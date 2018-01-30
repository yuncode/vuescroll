import Vue from 'vue/dist/vue'
import vuescroll from 'vuescroll'

Vue.use(vuescroll);
let template = 
`
<div style="width:100px;height:100px">
    <vueScroll ref="vs">
    <div style="width:200px;height:200px">
    </div>
    </vueScroll>
</div>
`

describe('vuescroll-test', () => {
    it('vuescroll should be installed', () => {
        expect(vuescroll.isInstalled).toBe(true);
    })
    it('vBar default should be left', () => {
        const vm = new Vue({
            template: template
        }).$mount();
        console.log(vm);
        expect(vm.$refs['vs'].$refs['vScrollbar'].ops.pos).toBe('left');
    });
})