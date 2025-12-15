tinymce.PluginManager.add('showme', function (editor, url) {
  // 注册一个工具栏按钮名称
  editor.ui.registry.addButton('showme', {
    text: '点我',
    onAction: function () {
      alert('我被点了')
    }
  })

  return {
    getMetadata: function () {
      return {
        //插件名和链接会显示在“帮助”→“插件”→“已安装的插件”中
        name: 'showme plugin',//插件名称
        url: 'http://exampleplugindocsurl.com', //作者网址
      }
    }
  }
})
