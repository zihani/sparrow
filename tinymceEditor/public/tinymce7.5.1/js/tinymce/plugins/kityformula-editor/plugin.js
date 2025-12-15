tinymce.PluginManager.add('kityformula-editor', function (editor, url) {
    var baseURL = tinymce.baseURL+'/plugins/kityformula-editor/kityFormula.html';
    // tinymce.kityformula
    var OpenDialog = function (param) {
        return editor.windowManager.openUrl({
            title: '插入公式',
            size: 'large',
            width: 785,
            height: 475,
            url:param?baseURL+"?c="+param:baseURL,
            buttons: [
                {
                    type: 'cancel',
                    text: 'Close'
                },
                {
                    type: 'custom',
                    text: 'Save',
                    name: 'save',
                    primary: true
                },
            ],
            onAction: function (api, details) {
                switch (details.name) {
                    case 'save':
                        api.sendMessage("save");
                        break;
                    default:
                        break;
                }
            }
        });
    };
    
    editor.ui.registry.addButton('kityformula-editor', {
        text: '公式',
        tooltip: '插入公式',
        onAction: function () {
            OpenDialog()
            // tinymce.kityformulaOpenDialog();
        }
    });
    editor.ui.registry.addMenuItem('kityformula-editor', {
        text: '公式',
        onAction: function () {
            OpenDialog()
            // tinymce.kityformulaOpenDialog();
        }
    });
    return {
        getMetadata: function() {
            return  {
                name: "公式",
                url: "http://hgcserver.gitee.io",
            };
        }
    };
});