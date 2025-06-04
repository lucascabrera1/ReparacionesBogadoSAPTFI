import { namespace } from '../Utils/request-context.js';

export function requestContextMiddleware(req, res, next) {
    const namespacerun = namespace.run(() => {
        next();
    });
    console.log("inicio namespacerun")
    console.log(namespacerun)
    console.log("final namespacerun")
} 