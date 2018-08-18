class IntentApp {
    constructor() {
        this.handler = (req, res, next) => { next(res) }
    }

    use(handler) {
        this.handler = (
        (prevHandler) => (req, res, next) => prevHandler(req, res, (newRes = res) => {
                handler(req, res, next)
            })
        )(this.handler)
    }

    intent(intentName, handler, intent = ((req) => req.body.queryResult.intent.displayName)) {
        this.use((req, res, next) => {
            try {
                intent(req)
            } catch(e) {
                next(res)
            }
            if(intentName instanceof RegExp) {
                if(intentName.test(intent(req))) {
                    handler(req, res, next)
                } else {
                    next(res)
                }
            } else if(intent(req) !== intentName) {
                next(res)
            } else {
                handler(req, res, next)
            }
        })
    }
}

module.exports = IntentApp