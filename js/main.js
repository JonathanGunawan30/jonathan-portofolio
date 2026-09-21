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

document.addEventListener('dragstart', event => {
  const target = event.target

  if (target instanceof Element &&
    (target.matches('img.no-drag') || target.querySelector('img.no-drag'))) {
    event.preventDefault()
  }
})


const modal = document.getElementById('projectModal')
const modalPanel = document.getElementById('modalPanel')
const modalContent = document.getElementById('modalContent')
const modalBackdrop = document.getElementById('modalBackdrop')
const modalDragHandle = document.getElementById('modalDragHandle')
const closeModal = document.getElementById('closeModal')

const mobileModal = window.matchMedia('(max-width: 767px)')
let dragPointerId = null
let dragStartY = 0
let dragStartTime = 0
let dragDistance = 0
let dragFrame = null

function resetModalDrag() {
  if (dragFrame) {
    cancelAnimationFrame(dragFrame)
    dragFrame = null
  }

  dragPointerId = null
  dragDistance = 0
  modalPanel.style.transition = ''
  modalPanel.style.transform = ''
  modalBackdrop.style.transition = ''
  modalBackdrop.style.opacity = ''
  modalDragHandle.style.cursor = 'grab'
}

function updateModalDrag() {
  modalPanel.style.transform = `translateY(${dragDistance}px)`
  modalBackdrop.style.opacity = Math.max(0, 1 - dragDistance / modalPanel.offsetHeight)
  dragFrame = null
}

function closeModalFromSwipe() {
  const transition = '220ms cubic-bezier(0.22, 1, 0.36, 1)'

  modalPanel.style.transition = `transform ${transition}`
  modalBackdrop.style.transition = `opacity ${transition}`
  modalPanel.style.transform = `translateY(${modalPanel.offsetHeight}px)`
  modalBackdrop.style.opacity = '0'

  window.setTimeout(hideModal, 220)
}

function finishModalDrag(event) {
  if (event.pointerId !== dragPointerId) return

  if (dragFrame) {
    cancelAnimationFrame(dragFrame)
    dragFrame = null
    updateModalDrag()
  }

  const elapsed = Math.max(performance.now() - dragStartTime, 1)
  const velocity = dragDistance / elapsed
  const closeThreshold = Math.min(140, modalPanel.offsetHeight * 0.25)
  const shouldClose = dragDistance >= closeThreshold || velocity >= 0.65

  if (modalDragHandle.hasPointerCapture(event.pointerId)) {
    modalDragHandle.releasePointerCapture(event.pointerId)
  }

  dragPointerId = null
  modalDragHandle.style.cursor = 'grab'

  if (shouldClose) {
    closeModalFromSwipe()
    return
  }

  const transition = '240ms cubic-bezier(0.22, 1, 0.36, 1)'
  modalPanel.style.transition = `transform ${transition}`
  modalBackdrop.style.transition = `opacity ${transition}`
  modalPanel.style.transform = ''
  modalBackdrop.style.opacity = ''
  dragDistance = 0
}

modalDragHandle.addEventListener('pointerdown', event => {
  if (!mobileModal.matches || event.button !== 0) return

  dragPointerId = event.pointerId
  dragStartY = event.clientY
  dragStartTime = performance.now()
  dragDistance = 0

  modalPanel.style.transition = 'none'
  modalBackdrop.style.transition = 'none'
  modalDragHandle.style.cursor = 'grabbing'
  modalDragHandle.setPointerCapture(event.pointerId)
})

modalDragHandle.addEventListener('pointermove', event => {
  if (event.pointerId !== dragPointerId) return

  dragDistance = Math.max(0, event.clientY - dragStartY)

  if (!dragFrame) {
    dragFrame = requestAnimationFrame(updateModalDrag)
  }
})

modalDragHandle.addEventListener('pointerup', finishModalDrag)
modalDragHandle.addEventListener('pointercancel', finishModalDrag)

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
              ${links.map(l => l.disabled ? `
                <span aria-disabled="true" title="Live demo unavailable" style="cursor: not-allowed;" class="h-12 px-6 rounded-xl border border-black/10 dark:border-white/10 text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                  <iconify-icon icon="${l.icon}" class="text-xl"></iconify-icon>
                  ${l.label}
                </span>
              ` : `
                <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="h-12 px-6 rounded-xl border border-black/10 dark:border-white/10 lg:hover:border-sky-500 flex items-center gap-2 transition-all">
                  <iconify-icon icon="${l.icon}" class="text-xl"></iconify-icon>
                  ${l.label}
                </a>
              `).join('')}
            </div>
          </div>
        `

    resetModalDrag()
    modal.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
  })
})

function hideModal() {
  modal.classList.add('hidden')
  document.body.style.overflow = ''
  resetModalDrag()
}

closeModal.addEventListener('click', hideModal)
modalBackdrop.addEventListener('click', hideModal)

const copyEmailButton = document.getElementById('copyEmail')
const copyEmailIcon = document.getElementById('copyEmailIcon')
const copyEmailStatus = document.getElementById('copyEmailStatus')
const contactEmail = 'jgunawan3005@gmail.com'
let copyEmailTimer = null

function fallbackCopyText(text) {
  const activeElement = document.activeElement
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '0'
  textarea.style.left = '-9999px'
  textarea.style.opacity = '0'
  textarea.style.fontSize = '16px'

  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)

  let copied = false

  try {
    copied = document.execCommand('copy')
  } finally {
    textarea.remove()

    if (activeElement instanceof HTMLElement) {
      activeElement.focus({ preventScroll: true })
    }
  }

  if (!copied) {
    throw new Error('Unable to copy text')
  }
}

async function copyText(text) {
  try {
    fallbackCopyText(text)
    return
  } catch (_) {}

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
    return
  }

  throw new Error('Clipboard access is unavailable')
}

function showCopyEmailFeedback(copied) {
  window.clearTimeout(copyEmailTimer)

  copyEmailIcon.setAttribute('icon', copied ? 'heroicons:check' : 'heroicons:x-mark')
  copyEmailStatus.textContent = copied ? 'Email address copied' : 'Copy failed, try again'
  copyEmailButton.setAttribute('aria-label', copied ? 'Email address copied' : 'Copy failed, try again')
  copyEmailButton.title = copied ? 'Email address copied' : 'Copy failed, try again'

  copyEmailTimer = window.setTimeout(() => {
    copyEmailIcon.setAttribute('icon', 'heroicons:clipboard')
    copyEmailStatus.textContent = ''
    copyEmailButton.setAttribute('aria-label', 'Copy email address')
    copyEmailButton.title = 'Copy email address'
  }, 2000)
}

copyEmailButton.addEventListener('click', async () => {
  try {
    await copyText(contactEmail)
    showCopyEmailFeedback(true)
  } catch (_) {
    showCopyEmailFeedback(false)
  }
})
