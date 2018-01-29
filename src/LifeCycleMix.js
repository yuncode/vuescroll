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
    
    if(this.$options.name === 'vueScroll') {
        var ops = deepMerge(GCF, {});
        deepMerge(ops, this.$options.propsData.ops);
    }else {
        this.$options.propsData.ops = this.$options.propsData.ops || {};
    var ops = deepMerge(GCF[this.$options.name], {});
    deepMerge(ops, this.$options.propsData.ops);
    if(this.$options.name === 'vBar' || this.$options.name === 'hBar') {
        if(this.$parent.ops[this.$options.name.charAt(0) + 'Rail']['pos']) {
            defineReactive(this.$options.propsData.ops, 'pos', this.$parent.ops[this.$options.name.charAt(0) + 'Rail']);
        }
        if(this.$parent.ops[this.$options.name.charAt(0) + 'Rail']['width']) {
            defineReactive(this.$options.propsData.ops, 'width', this.$parent.ops[this.$options.name.charAt(0) + 'Rail']);
        }
    } else if(this.$options.name === 'scrollContent') {
        if(this.$options.propsData.ops['padding'] == true) {
            let vm = this;
            let temp = deepMerge(vm.$options.propsData.state.style, {});
            Object.defineProperty(
                vm.$options.propsData.state,
                'style',
                {
                    get: function() {
                        let pos = vm.$parent.$parent.ops.vRail['pos'];
                        let padding = pos == 'right' ? 'paddingRight' : 'paddingLeft';
                        let otherPadding = pos == 'right' ? 'paddingLeft' : 'paddingRight';
                        let res = deepMerge(temp, {});
                        res[padding] = vm.$parent.$parent.ops.vRail['width'];
                        if(res[otherPadding]) {
                            delete res[otherPadding] ;
                        }
                        return res;
                    }
                }
            );
        }
    }
    }
}

export default {
    beforeCreate: function() {
        hackPropsData.call(this);
    },
    // before the component updated, after the render() function,
    // we shoule also merge the data again
    beforeUpdate() { 
        hackPropsData.call(this);
     }
}