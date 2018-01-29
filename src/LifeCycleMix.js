import GCF from './GlobalConfig' 
import {
     deepMerge,
     defineReactive
} from './util'
export default {
    beforeCreate: function() {
        if(this.name === 'vueScroll') {
            var ops = deepMerge(GCF[this.name], {});
            deepMerge(ops, this.$options.propsData.ops);
        }else {
            this.$options.propsData.ops = this.$options.propsData.ops || {};
        var ops = deepMerge(GCF[this.name], {});
        deepMerge(ops, this.$options.propsData.ops);
        if(this.name === 'vBar' || this.name === 'hBar') {
            if(this.$parent.ops[this.name.charAt(0) + 'Rail']['pos']) {
                defineReactive(this.$options.propsData.ops, 'pos', this.$parent.ops[this.name.charAt(0) + 'Rail']);
            }
            if(this.$parent.ops[this.name.charAt(0) + 'Rail']['width']) {
                defineReactive(this.$options.propsData.ops, 'width', this.$parent.ops[this.name.charAt(0) + 'Rail']);
            }
        } else if(this.name === 'scrollContent') {
            if(this.$options.propsData.ops['padding'] == true) {
                let vm = this;
                let temp = deepMerge(this.$options.propsData.ops, {});
                Object.defineProperty(
                    vm.$options.propsData,
                    'state',
                    {
                        get: function() {
                            let pos = vm.$parent.ops.vRail[pos];
                            let padding = pos == 'right' ? 'paddingRight' : 'paddingLeft';
                            let res = deepMerge(temp, {});
                            res[padding] = vm.$parent.ops.vRail['width'];
                            return res;
                        }
                    }
                );
            }
        }
        }
        
    },
    // before the component updated, after the render() function,
    // we shoule also merge the data again
    beforeUpdate() {
        if(this.name === 'vueScroll') {
            var ops = deepMerge(GCF[this.name], {});
            deepMerge(ops, this.$options.propsData.ops);
        }else {
            this.$options.propsData.ops = this.$options.propsData.ops || {};
            var ops = deepMerge(GCF[this.name], {});
            deepMerge(ops, this.$options.propsData.ops);
            if(this.name === 'vBar' || this.name === 'hBar') {
                if(this.$parent.ops[this.name.charAt(0) + 'Rail']['pos']) {
                    defineReactive(this.$options.propsData.ops, 'pos', this.$parent.ops[this.name.charAt(0) + 'Rail']);
                }
                if(this.$parent.ops[this.name.charAt(0) + 'Rail']['width']) {
                    defineReactive(this.$options.propsData.ops, 'width', this.$parent.ops[this.name.charAt(0) + 'Rail']);
                }
            } else if(this.name === 'scrollContent') {
                if(this.$options.propsData.ops['padding'] == true) {
                    let vm = this;
                    let temp = deepMerge(this.$options.propsData.ops, {});
                    Object.defineProperty(
                        vm.$options.propsData,
                        'state',
                        {
                            get: function() {
                                let pos = vm.$parent.ops.vRail[pos];
                                let padding = pos == 'right' ? 'paddingRight' : 'paddingLeft';
                                let res = deepMerge(temp, {});
                                res[padding] = vm.$parent.ops.vRail['width'];
                                return res;
                            }
                        }
                    );
                }
            }
        } 
    }
}