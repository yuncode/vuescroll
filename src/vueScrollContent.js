// scrollContent
export default  {
    name: 'vueScrollContent',
    render: function(_c) {
        var vm = this;

        return _c(vm.ops.tag, {
            style: vm.state.style,
            class: "vueScrollContent",
            props: vm.ops.props,
            attrs: vm.ops.attrs
        }, this.$slots.default);
    },
    props: {
        ops: {},
        state: {
        }
    }
}