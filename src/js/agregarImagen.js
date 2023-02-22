import { Dropzone } from "dropzone";

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imágenes aquí',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFileSize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dicRemoveFile: 'Borrar Archivo',
    dicMaxFilesExceeded: 'El limite es 1 archivo',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function() {
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar')

        btnPublicar.addEventListener('click', function() {
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function() {
            if(dropzone.getActiveFiles().length == 0) {
                window.location.href = '/mis-propiedades'
            }
        })
    }
}