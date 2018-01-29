/*
    * @name: vuescroll 3.3.6
    * @author: (c) 2018-2018 wangyi7099
    * @description: A virtual scrollbar based on vue.js 2.x inspired by slimscroll
    * @license: MIT
    * @GitHub: https://github.com/wangyi7099/vuescroll
    */
   
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('Vue')) :
	typeof define === 'function' && define.amd ? define(['Vue'], factory) :
	(global.vuescroll = factory(global.Vue));
}(this, (function (Vue) { 'use strict';

Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

var GCF = {
    // 
    scrollContent: {
        tag: 'div',
        padding: true,
        height: '100%',
        props: {
        },
        attrs: {
        }
    },
    // 
    vRail: {
        width: '5px',
        pos: 'left',
        background: "#a5d6a7",
        opacity: 0 //'0.5'
    },
    // 
    vBar: {
        width: '5px',
        pos: 'left',
        background: '#4caf50',
        deltaY: 100,
        keepShow: false,
        opacity: 1,
    },
    // 
    hRail: {
        height: '5px',
        pos: 'bottom',
        background: "#a5d6a7",
        opacity: 0 //'0.5'
    },
    // 
    hBar: {
        height: '5px',
        pos: 'bottom',
        background: '#4caf50',
        keepShow: false,
        opacity: 1
    }
}

/**
     * @description return the computed value of a dom
     * @author wangyi7099
     * @param {any} dom 
     * @param {any} property 
     */
    function getComputed(dom, property) {
        return window.getComputedStyle(dom).getPropertyValue(property);
    }

    /**
     * @description deepCopy a object.
     * 
     * @param {any} source 
     * @returns 
     */
    function deepCopy(source, target) {
        target = typeof target === 'object'&&target || {};
        for (var key in source) {
            target[key] = typeof source[key] === 'object' ? deepCopy(source[key], target[key] = {}) : source[key];
        }
        return target;
    }
    
    /**
     * 
     * @description deepMerge a object.
     * @param {any} from 
     * @param {any} to 
     */
    function deepMerge(from, to) {
        to = to || {};
        for (var key in from) {
            if (typeof from[key] === 'object') {
                if (!to[key]) {
                    to[key] = {};
                    deepCopy(from[key], to[key]);
                } else {
                    deepMerge(from[key], to[key]);
                }
            } else {
                if(!to[key])
                to[key] = from[key];
            }
        }
        return to;
    }
    /**
     * @description define a object reactive
     * @author wangyi
     * @export
     * @param {any} target 
     * @param {any} key 
     * @param {any} source 
     */
    function defineReactive(target, key, source) {
        Object.defineProperty(target, key, {
            get: function() {
                return source[key];
            }
        });
    }

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

var LifeCycleMix = {
    beforeCreate: function() {
        hackPropsData.call(this);
    },
    // before the component updated, after the render() function,
    // we shoule also merge the data again
    beforeUpdate() { 
        hackPropsData.call(this);
     }
}

// vertical rail
var vRail = {
    name: 'vRail',
    mixins: [LifeCycleMix],
    render: function(_c) {
        var vm = this;
        var style = {
            position: 'absolute',
            top: 0,
            height: '100%',
            width: vm.ops.width,
            background: vm.ops.background,
            opacity: vm.ops.opacity,
            borderRadius: '4px'
        };
        // determine the position
        if (vm.ops.pos == 'right') {
            style['right'] = 0;
        } else {
            style['left'] = 0;
        }

        return _c('div', {
            style: style,
            on: {
                "click": function(e) {
                    vm.$emit('scrollContentByBar', e, 'vScrollbar');
                }
            }
        }, this.$slots.default);
    },
    props: {
        ops:{
            default: function() {
                return {
                    width: {
                        default: '5px'
                    },
                    pos: {
                        default: 'left'
                    },
                    background: {
                        default: '#a5d6a7'
                    },
                    opacity: {
                        default: '0.5'
                    }
                }
            }
        } 
    }
}

// vertical scrollBar
var vScrollbar = {
    name: 'vBar',
    mixins: [LifeCycleMix],
    computed: {
        computedTop() {
            return this.state.top * 100;
        },
        computedHeight() {
            return this.state.height * 100
        }
    },
    render: function(_c) {
        var vm = this;
        var style = {
            position: 'absolute',
            top: 0,
            height: vm.computedHeight + '%',
            width: vm.ops.width,
            background: vm.ops.background,
            borderRadius: '4px',
            transform: "translateY(" + vm.computedTop + "%)",
            transition: 'opacity .5s',
            cursor: 'pointer',
            opacity: vm.state.opacity,
            userSelect: 'none'
        };
        // determine the position
        if (vm.ops.pos == 'right') {
            style['right'] = 0;
        } else {
            style['left'] = 0;
        }

        return _c('div', {
            style: style,
            class: "vScrollbar"
        });
    },
    props: {
        ops: {
            default: function(){
                return {
                    background: 'hsla(220,4%,58%,.3)',
                    opacity: 0,
                    pos: 'left',
                    width: '5px'
                } 
            }
        },
        state: {
            default:function(){
                return {
                    top: {
                        default: 0
                    },
                    height: {
                        default: 0
                    },
                    opacity: {
                        default: 0
                    }
                }
            } 
        }
    }
}

// horizontal rail
var hRail = {
    name: 'hRail',
    mixins: [LifeCycleMix],
    render: function(_c) {
        var vm = this;
        var style = {
            position: 'absolute',
            left: 0,
            width: '100%',
            height: vm.ops.height,
            background: vm.ops.background,
            opacity: vm.ops.opacity,
            borderRadius: '4px'
        };
        // determine the position
        if (vm.ops.pos == 'top') {
            style['top'] = 0;
        } else {
            style['bottom'] = 0;
        }

        return _c('div', {
            style: style,
            on: {
                "click": function(e) {
                    vm.$emit('scrollContentByBar', e, 'hScrollbar');
                }
            }
        }, this.$slots.default);
    },
    props: {
        ops: {
            default: function(){
                return {
                    height: {
                        default: '5px'
                    },
                    pos: {
                        default: 'bottom'
                    },
                    background: {
                        default: '#a5d6a7'
                    },
                    opacity: {
                        default: '0.5'
                    }
                }
            }
        }
         
    }
}

// horizontal scrollBar
var hScrollbar = {
    name: 'hBar',
    mixins: [LifeCycleMix],
    computed: {
        computedLeft: function() {
            return this.state.left * 100;
        },
        computedWidth: function() {
            return this.state.width * 100
        }
    },
    render: function(_c) {
        var vm = this;
        var style = {
            position: 'absolute',
            width: vm.computedWidth + '%',
            height: vm.ops.height,
            background: vm.ops.background,
            borderRadius: '4px',
            transform: "translateX(" + vm.computedLeft + "%)",
            transition: 'opacity .5s',
            cursor: 'pointer',
            opacity: vm.state.opacity,
            userSelect: 'none'
        };
        // determine the position
        if (vm.ops.pos == 'top') {
            style['top'] = 0;
        } else {
            style['bottom'] = 0;
        }
        return _c('div', {
            style: style,
            class: "hScrollbar"
        });
    },
    props: {
        ops: {
            default: function() {
                return {
                    background: 'hsla(220,4%,58%,.3)',
                    opacity: 0,
                    pos: 'bottom',
                    height: '5px'
                }   
            }
        },
        state: {
            default: function(){
                return {
                    left: {
                        default: 0
                    },
                    width: {
                        default: 0
                    },
                    opacity: {
                        default: 0
                    }
                }
            }
        }
    }
}

// scrollContent
var vueScrollContent = {
    name: 'scrollContent',
    mixins: [LifeCycleMix],
    render: function(_c) {
        var vm = this;
        var style = vm.state.style;
        style.height = vm.ops.height;
        return _c(vm.ops.tag, {
            style: style,
            class: "scrollContent",
            props: vm.ops.props,
            attrs: vm.ops.attrs
        }, this.$slots.default);
    },
    props: {
        ops: {
            default: function() {
                return {

                }
            }
        },
        state: {
            default: function() {
                return {

                }
            }
        }
    }
}

// vueScrollPanel
var vueScrollPanel = {
    name: 'scrollPanel',
    render: function(_c) {
        var vm = this;
        return _c('div', {
            style: {
                overflow: 'scroll',
                marginRight: '-17px',
                height: 'calc(100% + 17px)'
            },
            class: "vueScrollPanel",
            on: {
                scroll: function(e) {
                    vm.$emit('scrolling', e);
                },
                wheel: function(e) {
                    vm.$emit('wheeling', e);
                }
            }
        }, this.$slots.default);
    }
}

// vuescroll core module

// import config
var vueScroll = {
    name: "vueScroll",
    mixins: [LifeCycleMix],
    data: function() {
        return {
            scrollPanel: {
                el: "",

            },
            scrollContent: {
                state: {
                    style: {
                        minHeight: '100%',
                        boxSizing: 'border-box'
                    }
                }
            },
            vRail: {
            },
            vScrollbar: {
                el: "",
                state: {
                    top: 0,
                    height: 0,
                    opacity: 0
                }
            },
            hRail: {
            },
            hScrollbar: {
                el: "",
                state: {
                    left: 0,
                    width: 0,
                    opacity: 0,
                    pos: 'bottom'
                }
            },
            listeners: [],
            mousedown: false,
            isMouseLeavePanel: true,
            isWheeling: false
        }
    },
    render: function(_c) {
        var vm = this;
        return _c('div', {
            class: 'vueScroll',
            style: {
                position: 'relative',
                height: '100%',
                width: '100%',
                overflow: 'hidden'
            },
            on: {
                mouseenter: function() {
                    vm.isMouseLeavePanel = false;
                    vm.showBar();
                },
                mouseleave: function() {
                    vm.isMouseLeavePanel = true;
                    vm.hideBar();
                },
                mousemove: function() {
                    vm.isMouseLeavePanel = false;
                    vm.showBar();
                }
            },
        }, [_c('scrollPanel', {
            ref: 'scrollPanel',
            porps: {
            },
            on: {
                scrolling: vm.scroll,
                wheeling: vm.wheel
            }
        }, [_c('scrollContent', {
            props: {
                ops: vm.ops.scrollContent,
                state: vm.scrollContent.state
            }
        }, vm.$slots.default)]), _c('vRail', {
            props: {
                ops: vm.ops.vRail
            },
            on: {
                scrollContentByBar: vm.scrollContentByBar
            }
        }), _c("vBar", {
            props: {
                ops: vm.ops.vBar,
                state: vm.vScrollbar.state
            },
            ref: "vScrollbar"
        }), _c('hRail', {
            props: {
                ops: vm.ops.hRail
            },
            on: {
                scrollContentByBar: vm.scrollContentByBar
            }
        }), _c('hBar', {
            props: {
                ops: vm.ops.hBar,
                state: vm.hScrollbar.state
            },
            ref: "hScrollbar"
        })]);
    },
    mounted: function() {
        this.initEl();
        this.initBarDrag();
        this.listenPanelTouch();
        // showbar at init time
        this.showBar();
    },
    methods: {
        initEl: function() {
            this.scrollPanel.el = this.$refs['scrollPanel'] && this.$refs['scrollPanel'].$el;
            this.vScrollbar.el = this.$refs['vScrollbar'] && this.$refs['vScrollbar'].$el;
            this.hScrollbar.el = this.$refs['hScrollbar'] && this.$refs['hScrollbar'].$el;
        },
        initBarDrag: function() {
            var vScrollbar = this.listenBarDrag('vScrollbar');
            var hScrollbar = this.listenBarDrag('hScrollbar');
            vScrollbar();
            hScrollbar();
        },
        // get the bar height or width
        getBarPropertyValue: function(type, scrollPanelPropertyValue, scrollPanelScrollPropertyValue) {
            var scrollPropertyValue = scrollPanelPropertyValue / scrollPanelScrollPropertyValue;
            if ((scrollPanelScrollPropertyValue <= scrollPanelPropertyValue) || Math.abs(scrollPanelPropertyValue - scrollPanelScrollPropertyValue) <= this.accuracy) {
                scrollPropertyValue = 0;
            }
            return scrollPropertyValue;
        },
        // adjust a bar's position
        adjustBarPos: function(scrollPropertyValue, scrollPanelPropertyValue, scrollDirectionValue, scrollPanelScrollValue) {
            return parseFloat(scrollDirectionValue / scrollPanelPropertyValue);
        },
        // show All bar
        showBar: function() {
            this.showVBar();
            this.showHBar();
        },
        // hide all bar
        hideBar: function() {
            this.hideVBar();
            this.hideHBar();
        },
        // showVbar
        showVBar: function() {
            if (!this.isMouseLeavePanel || this.ops.vBar.keepShow || this.mousedown) {
                var scrollPanelPropertyValue = Math.floor(getComputed(this.scrollPanel.el, 'height').replace('px', ""));
                var scrollPanelScrollPropertyValue = Math.floor(this.scrollPanel.el['scrollHeight']);
                var scrollDirectionValue = Math.floor(this.scrollPanel.el['scrollTop']);
                if ((this.vScrollbar.state.height = this.getBarPropertyValue('vScrollbar', scrollPanelPropertyValue, scrollPanelScrollPropertyValue))) {
                    this.vScrollbar.state.top = this.adjustBarPos(this.vScrollbar.state.height, scrollPanelPropertyValue - 0, scrollDirectionValue, scrollPanelScrollPropertyValue);
                    this.vScrollbar.state.opacity = this.ops.vBar.opacity;
                }
            }
        },
        // showHbar
        showHBar: function() {
            if (!this.isMouseLeavePanel || this.ops.hBar.keepShow || this.mousedown) {
                var scrollPanelPropertyValue = Math.floor(getComputed(this.scrollPanel.el, 'width').replace('px', ""));
                var scrollPanelScrollPropertyValue = Math.floor(this.scrollPanel.el['scrollWidth']);
                var scrollDirectionValue = Math.floor(this.scrollPanel.el['scrollLeft']);
                if ((this.hScrollbar.state.width = this.getBarPropertyValue('hScrollbar', scrollPanelPropertyValue, scrollPanelScrollPropertyValue))) {
                    this.hScrollbar.state.left = this.adjustBarPos(this.vScrollbar.state.width, scrollPanelPropertyValue - 0, scrollDirectionValue, scrollPanelScrollPropertyValue);
                    this.hScrollbar.state.opacity = this.ops.hBar.opacity;
                }
            }
        },
        // hideVbar
        hideVBar: function() {
            if (!this.ops.vBar.keepShow) {
                if (!this.mousedown && this.isMouseLeavePanel) {
                    this.vScrollbar.state.opacity = 0;
                }
            }
        },
        // hideHbar
        hideHBar: function() {
            if (!this.ops.hBar.keepShow) {
                if (!this.mousedown && this.isMouseLeavePanel) {
                    this.hScrollbar.state.opacity = 0;
                }
            }
        },
        wheel: function(e) {
            var vm = this;
            var delta = vm.ops.vBar.deltaY;
            vm.isWheeling = true;
            vm.showVBar();
            vm.scrollBar(e.deltaY > 0 ? delta : -delta, 'vScrollbar');
            e.preventDefault();
            e.stopPropagation();
        },
        // listen wheel scrolling
        scroll: function(e) {
            // console.log(e);
            if(this.isWheeling) {
                e.preventDefault();
                this.isWheeling = false;
                return;
            }
            this.showBar();
        },
        // scroll content and resize bar.
        scrollBar: function(distance, type) {
            // >0 scroll to down or right  <0 scroll to up or left
            var direction = type == 'vScrollbar' ? 'top' : 'left';
            var upperCaseDirection = type == 'vScrollbar' ? 'Top' : 'Left';
            var property = type == 'vScrollbar' ? 'height' : 'width';
            var upperCaseProperty = type == 'vScrollbar' ? 'Height' : 'Width';
            var event = type == 'vScrollbar' ? 'vscroll' : 'hscroll';
            var showEvent = type == 'vScrollbar' ? 'showVBar' : 'showHBar';
            var directionValue = this[type].state[direction];
            var scrollPanelPropertyValue = getComputed(this.scrollPanel.el, property).replace('px', "");
            if (type == 'vScrollbar') {
                scrollPanelPropertyValue = scrollPanelPropertyValue ;
            }
            var scrollPanelScrollValue = this.scrollPanel.el['scroll' + upperCaseProperty];
            var scrollDirectionValue = this.scrollPanel.el['scroll' + upperCaseDirection];
            var scrollPropertyValue = this[type].state[property];
            var ScrollDirectionValue = Math.round(scrollDirectionValue + distance);
            if (distance < 0) {
                // scroll up or left
                this.scrollPanel.el['scroll' + upperCaseDirection] = Math.max(0, ScrollDirectionValue);
            } else if (distance > 0) {
                // scroll down or right
                this.scrollPanel.el['scroll' + upperCaseDirection] = Math.min(scrollPanelScrollValue - scrollPanelPropertyValue, ScrollDirectionValue);
            }
            this[showEvent]();
            var content = {};
            var bar = {};
            var process = "";
            
            ScrollDirectionValue = this.scrollPanel.el['scroll' + upperCaseDirection];
            content.residual = (scrollPanelScrollValue - ScrollDirectionValue - scrollPanelPropertyValue);
            content.scrolled = ScrollDirectionValue;
            bar.scrolled = this[type].state[direction];
            bar.residual = (content.residual / scrollPanelScrollValue) * scrollPanelPropertyValue;
            bar[property] = this[type].state[property] * scrollPanelPropertyValue;
            process = ScrollDirectionValue / (scrollPanelScrollValue - scrollPanelPropertyValue);
            bar.name = type;
            content.name = "content";
            this.$emit(event, bar, content, process);
        },
        // convert scrollbar's distance to content distance.
        _scrollContent: function(distance, type) {
            var property = type == 'vScrollbar' ? 'height' : 'width';
            var upperCaseProperty = type == 'vScrollbar' ? 'Height' : 'Width';
            var scrollPanelPropertyValue = getComputed(this.scrollPanel.el, property).replace('px', "");
            if (type == 'vScrollbar') {
                scrollPanelPropertyValue = scrollPanelPropertyValue  ;
            }
            var scrollPanelScrollValue = this.scrollPanel.el['scroll' + upperCaseProperty];
            var scrollContentDistance = scrollPanelScrollValue * (distance / scrollPanelPropertyValue);
            this.scrollBar(scrollContentDistance, type);
        },
        // click the rail and trigger the scrollbar moving
        scrollContentByBar: function(e, type) {
            var coco = type === 'vScrollbar' ? 'y' : 'x';
            var elementInfo = this[type].el.getBoundingClientRect();
            var delta = e[coco] - elementInfo[coco] - elementInfo.height / 2;
            this._scrollContent(delta, type);
        },
        listenBarDrag: function(type) {
            var vm = this;
            var coordinate = type === 'vScrollbar' ? 'pageY' : 'pageX';
            var bar = type === 'vScrollbar' ? 'VBar' : 'HBar';
            return function() {
                var pre;
                var now;
                function move(e) {
                    now = e[coordinate];
                    var delta = now - pre;
                    vm['show' + bar]();
                    vm._scrollContent(delta, type);
                    pre = now;
                }
                function t(e) {
                    e.stopPropagation();
                    vm.mousedown = true;
                    pre = e[coordinate];
                    vm['show' + bar]();
                    document.addEventListener('mousemove', move);
                    document.addEventListener('mouseup', function(e) {
                        vm.mousedown = false;
                        vm['hide' + bar]();
                        document.removeEventListener('mousemove', move);
                    });
                }
                vm.listeners.push({
                    dom: vm[type].el,
                    event: t,
                    type: "mousedown"
                });
                vm[type].el.addEventListener('mousedown', t);
            }
        },
        listenPanelTouch: function() {
            var vm = this;
            var pannel = this.scrollPanel.el;
            function t(e) {
                if (e.touches.length) {
                    e.stopPropagation();
                    vm.mousedown = true;
                    vm.showBar();
                    pannel.addEventListener('touchend', function(e) {
                        vm.mousedown = false;
                        vm.hideBar();
                    });
                }
            }
            pannel.addEventListener('touchstart', t);
            vm.listeners.push({
                dom: pannel,
                event: t,
                type: "touchstart"
            });
        }
    },
    beforeDestroy: function() {
        // remove the registryed event.
        this.listeners.forEach(function(item) {
            item.dom.removeEventListener(item.type, item.event);
        });
    },
    updated: function() {
        this.showBar();
        this.hideBar();
    },
    props: {
        ops:{
            default: function() {
               return {
                scrollContent: {

                },
                vRail: {

                },
                vBar: {

                },
                hRail: {

                },
                hBar: {

                }
               }
            }
        },
        accuracy: {
            default: 5
        }
    }
}

// import component
// import config
// external Vue
var scroll = {
    install: function(Vue$$1) {
        Vue$$1.component(vRail.name, vRail);
        Vue$$1.component(vScrollbar.name, vScrollbar);
        Vue$$1.component(hRail.name, hRail);
        Vue$$1.component(hScrollbar.name, hScrollbar);
        Vue$$1.component(vueScrollContent.name, vueScrollContent);
        Vue$$1.component(vueScrollPanel.name, vueScrollPanel);
        //vueScroll
        Vue$$1.component(vueScroll.name, vueScroll);

        // registry the globe setting
        Vue$$1.prototype.$vuescrollConfig = GCF;
    }
};

if(typeof Vue !== 'undefined') {
    Vue.use(scroll);
}

return scroll;

})));
