(function() {

    const nav = document.querySelector('#nav')
    const divMenu = document.querySelector('#divMenu')

    const menu = document.querySelector('#menu')
    menu.addEventListener('click', () => {
        mostrarMenu()
    })

    function mostrarMenu() {
        if(nav.classList.contains('hidden')) {
            nav.classList.remove('hidden')
            nav.classList.add('flex', 'flex-col')
            divMenu.classList.add('flex-col', 'gap-5', 'items-center')
        } else {
            nav.classList.add('hidden')
            nav.classList.remove('flex', 'flex-col')
            divMenu.classList.remove('flex-col', 'gap-5', 'items-center')
        }
    }
})()