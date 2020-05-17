const { Action } = require('../interfaces/index')

class MoveRight extends Action {
    constructor() {
        super()
        this.name = 'MoveRight'
        this.desc = 'MoveRight'
        this.cmd = null
        this.icons = null
        this.shortcuts = ['→']
    }

    exec(aqua, event, state = {}) {
        const fn = (cursor, clearSelection = true) => {
            if (clearSelection) {
                cursor.selection.reset()
            }

            const max = aqua.docMgr.size - 1
            const lineLen = aqua.docMgr.getLine(cursor.logicalY).length

            if (cursor.logicalX >= lineLen) {
                if (cursor.logicalY === max) {
                    return
                }

                cursor.logicalY = cursor.logicalY + 1
                cursor.logicalX = 0

                return
            }

            cursor.logicalX = cursor.logicalX + 1
        }

        if (state.cursor) {
            fn(state.cursor, false)

            return
        }

        aqua.cursorMgr.traverse(fn, {
            acc: false,
        })
    }
}

module.exports = MoveRight
