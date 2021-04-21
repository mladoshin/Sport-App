import React from "react"
import { CKEditor } from '@ckeditor/ckeditor5-react';
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

//editor component
function Editor(props) {
    var data = props.data
    var setData = props.setData

    console.log("Data in editor: ")
    console.log(data)
    return (
        <>
            <div id="toolbar"></div>
            <CKEditor
                editor={DecoupledEditor}
                data={data}
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);

                    const toolbarContainer = document.getElementById('toolbar');
                    console.log(toolbarContainer)

                    !props.readOnly && toolbarContainer.appendChild(editor.ui.view.toolbar.element);

                    window.editor = editor;
                    editor.isReadOnly = props.readOnly
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setData(data)
                    console.log({ event, editor, data });

                }}
                onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                }}
            />
        </>
    )
}

export default Editor