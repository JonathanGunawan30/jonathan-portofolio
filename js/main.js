const toggle = document.getElementById('themeToggle')
const themeIcon = document.getElementById('themeIcon')

if (localStorage.theme === 'dark') {
  document.documentElement.classList.add('dark')
  themeIcon.setAttribute('icon', 'heroicons:sun')
}

toggle.addEventListener('click', () => {

  document.documentElement.classList.toggle('dark')

  const isDark = document.documentElement.classList.contains('dark')

  localStorage.theme = isDark ? 'dark' : 'light'

  themeIcon.setAttribute('icon', isDark ? 'heroicons:sun' : 'heroicons:moon')

})

const observer = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {
      entry.target.classList.add('show')
    }

  })

}, {
  threshold: 0.1
})

document.querySelectorAll('.fade-up').forEach(el => {
  observer.observe(el)
})


const modal = document.getElementById('projectModal')
const modalContent = document.getElementById('modalContent')
const modalBackdrop = document.getElementById('modalBackdrop')
const closeModal = document.getElementById('closeModal')

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const data = card.dataset
    const tech = JSON.parse(data.tech)
    const links = JSON.parse(data.links)

    modalContent.innerHTML = `
          <div class="mb-8">
            <div class="text-sky-500 uppercase tracking-[0.2em] text-xs font-bold mb-4">
              ${data.subtitle}
            </div>
            <h2 class="text-4xl md:text-5xl font-bold tracking-[-0.05em] mb-6">
              ${data.title}
            </h2>
            <p class="text-zinc-600 dark:text-zinc-400 leading-8 text-lg mb-8">
              ${data.longDescription}
            </p>
          </div>

          <div class="mb-10">
            <h4 class="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
              Technologies Used
            </h4>
            <div class="flex flex-wrap gap-2">
              ${tech.map(t => `
                <div class="px-4 py-2 rounded-xl bg-sky-500/10 text-sky-500 text-sm font-medium">
                  ${t}
                </div>
              `).join('')}
            </div>
          </div>

          <div>
            <h4 class="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
              Project Links
            </h4>
            <div class="flex flex-wrap gap-4">
              ${links.map(l => `
                <a href="${l.url}" target="_blank" class="h-12 px-6 rounded-xl border border-black/10 dark:border-white/10 lg:hover:border-sky-500 flex items-center gap-2 transition-all">
                  <iconify-icon icon="${l.icon}" class="text-xl"></iconify-icon>
                  ${l.label}
                </a>
              `).join('')}
            </div>
          </div>
        `

    modal.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
  })
})

function hideModal() {
  modal.classList.add('hidden')
  document.body.style.overflow = ''
}

closeModal.addEventListener('click', hideModal)
modalBackdrop.addEventListener('click', hideModal)