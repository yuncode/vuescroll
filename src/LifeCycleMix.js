import GCF from './GlobalConfig' 
import {
     deepMerge,
     defineReactive
} from './util'

/**
 * hack the lifeCycle 
 * 
 * to merge the global data into user-define data
 */
function hackPropsData() {
    let vm = this;
    if(vm.$options.name === 'vueScroll') {
        let ops = deepMerge(GCF, {});
        deepMerge(ops, vm.$options.propsData.ops || (vm.$options.propsData.ops = {}));
        deepMerge(vm.$options.propsData.ops, vm.fOps);
        // sync the rail and bar
        defineReactive(vm.fOps.vBar, 'ops', vm.fOps.vRail);
        defineReactive(vm.fOps.vBar, 'width', vm.fOps.vRail);
        defineReactive(vm.fOps.hBar, 'ops', vm.fOps.hRail);
        defineReactive(vm.fOps.hBar, 'height', vm.fOps.hRail);
        
        let temp = deepMerge(vm.scrollContent.state.style, {});
        Object.defineProperty(vm.scrollContent.state, 'style', {
            get() {
                let res = temp;
                let pos = vm.fOps.vRail['pos'];
                let padding = pos == 'right' ? 'paddingRight' : 'paddingLeft';
                let otherPadding = pos == 'right' ? 'paddingLeft' : 'paddingRight';
                // sync the scrollContent.padding
                res['height'] = vm.fOps.scrollContent.height;
                if(res[otherPadding]) {
                    delete res[otherPadding];
                }
                if(vm.fOps.scrollContent.padding) {
                    res[padding] = vm.fOps.vRail.width;
                }
                return res;
            }
        })
        // defineReactive(vm.scrollContent.style, )
    } 
     
}
export default {
    created: function() {
        hackPropsData.call(this);
    }
}