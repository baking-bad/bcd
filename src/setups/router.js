import Router from "vue-router";

export function fixNavigationCurrentLocationProblem() {
    const originalPush = Router.prototype.push
    Router.prototype.push = function push(location, onResolve, onReject) {
        if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
        return originalPush.call(this, location).catch(err => err)
    }
}
