function(_c1,_c2,_c3,_c4,_c5,_c6,_c7,_c8,_c9,_c10,_c11,_c12,_c13,_c14,_c15,_c16,_c17,_c18,_c19,_c20,_c21,_c22,_c23
    ,_c24,_c25,_c26){

    return {
        'res-delete':_c1._$$ResDeleteCommand,
        'res-redirect':_c2._$$ResCreateCommand,
        'list-detail':_c3._$$ShowDetailCommand,
        'value-modify':{
            event:['dblclick'],
            impl:_c4._$$Modify
        },
        'pgroup-setting':_c5._$$PgroupSetCommand,
        'add-toolbar-proj':_c6._$$AddProjInToolbar,
        'add-toolbar-prog':_c7._$$AddProgInToolbar,
        'parameter-del':_c8._$$ParameterDel,
        'parameter-add':_c9._$$ParameterAdd,
        'parameter-import':_c10._$$ParameterImport,
        'pgroup-detail':_c11._$$PgroupViewCommand,
        'pgroup-logout':_c12._$$PgroupLogoutCommand,
        'project-test':_c13._$$ProjectTest,
        'interface-test':_c14._$$InterfaceTest,
        'pgroup-proj-delete': _c15._$$PgroupProjDelCommand,
        'detail-redirect': _c16._$$DetailRedirectCommand,
        'detail-res-add': _c17._$$ResAddCommand,
        'res-share' :_c18._$$ResShareCommand,
        'detail-res-del' :_c19._$$PageResDelCommand,
        'attribute-add' : _c20._$$AttributeAdd,
        'attribute-del' : _c21._$$AttributeDel,
        'menu-modify' :_c22._$$MenuModifyCommand,
        'tag-edit' :{
            event:['dblclick'],
            impl:_c23._$$TagEditCommand
        },
        'winform-show':_c24._$$WinFormShowCommand,
        'res-search':_c25._$$ResSearchCommand,
        'project-view':_c26._$$ProjectViewCommand
    }

}