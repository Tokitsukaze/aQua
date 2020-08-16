const { rAF, Limiter } = require('../utils/index')

class Scroller {
    constructor(aqua, options) {
        this.aqua = aqua

        this.$el = null
        this.y = -1
        this.speed = -1
        this.min = -1
        this.max = -1

        // this.overflowType = 'buffer' // 'buffer', ['timeout', 'timeout'], null
        // this.overflowBuffer = 2500
        // this.overflowTimeout = 0.5
        // this.prevent = true
        this.lastScrollTime = 0

        this.limitedScroll = Limiter.toNextTick(this.scrollPrototype.bind(this), 34, 34)
    }

    init({
        $el = null,
        y = -1,
        speed = -1,
        min = -1,
        max = -1,
    } = {}) {
        /* @Test */
        this.$el = $el
        this.y = y
        this.speed = speed
        this.min = min
        this.max = max

        const docMgr = this.aqua.docMgr
        const korwa = this.aqua.korwa

        this.aqua.docWatcher.on('resize', () => {
            this.max = docMgr.height - korwa.getSingleLineHeight()

            if (this.y > this.max) {
                this.scroll(this.max)
            }
        })
    }

    handleScroll(event) {
        const y = this.correctY(this.y + event.delta * this.speed)

        this.scroll(y)

        if (y <= this.max && y >= this.min) {
            event.preventDefault()

            return
        }
    }

    scroll(y = this.y, force = false) {
        this.y = this.correctY(y)
        this.limitedScroll(this.y, force)
    }

    scrollImmediately(y = this.y, force = false) {
        this.y = this.correctY(y)
        this.scrollPrototype(this.y, force)
    }

    scrollPrototype(y = this.y, force = false) {
        this.aqua.khala.emit('scroll', y, force)
    }

    correctY(y) {
        if (y <= this.min) {
            y = this.min
        }

        if (y >= this.max) {
            y = this.max
        }

        return y
    }

    transformHeight(viewport, heightInViewport, minHeight = 0) {
        return Math.max(heightInViewport / (this.max + viewport.height) * viewport.height, minHeight)
    }

    transformY(viewport, yInViewport, heightInScrollBar = 0) {
        return yInViewport / this.max * (viewport.height - heightInScrollBar)
    }
}

module.exports = Scroller
