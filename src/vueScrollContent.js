import LifeCycleMix from './LifeCycleMix';


// scrollContent
export default  {
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