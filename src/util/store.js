/**
 * @name Ink Store
 * @desc Keeps track of changes to ripple epicenters
 * so that <Ink /> can focus on rendering them.
 */

var Equations = require('./equations')

module.exports = function(publicize) {
  let _data = []
  let _playing = false
  let _totalOpacity = 0
  let _frame

  let Store = {

    map(callback, scope) {
      return _data.map(callback, scope)
    },

    play() {
      if (!_playing) {
        _playing = true
        Store.update()
      }
    },

    stop() {
      _playing = false;
      cancelAnimationFrame(_frame)
    },

    getTotalOpacity() {
      return _totalOpacity
    },

    update() {
      _totalOpacity = 0

      Store.prune()

      publicize(_frame)

      if (_data.length) {
        _frame = requestAnimationFrame(Store.update)
      } else {
        Store.stop()
      }
    },

    shouldPrune(blot) {
      blot.opacity   = Equations.getBlotOpacity(blot)
      blot.transform = Equations.getBlotTransform(blot)

      _totalOpacity += Equations.getBlotOuterOpacity(blot)

      return blot.opacity >= 0.01
    },

    prune() {
      _data = _data.filter(this.shouldPrune)
    },

    add(props) {
      _data.push(props)
      Store.play()
    },

    release(time) {
      for (let i = _data.length - 1; i >= 0; i--) {
        if (!_data[i].mouseUp) {
          return _data[i].mouseUp = time
        }
      }
    }

  }

  return Store
}
