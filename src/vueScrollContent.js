// scrollContent
export default  {
    name: 'scrollContent',
    render: function(_c) {
        var vm = this;
        vm.state.style.height = vm.ops.height;
        return _c(vm.ops.tag, {
            style: vm.state.style,
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