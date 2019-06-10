jQuery(document).ready(function ($) {
  if (document.body.className.includes('docs')) {
    handleScrollTo()
    handleToggle()
    const tracker = new ScrollTracker(updateDom)
  }
})

function handleToggle() {
  $('.sidenav-chapter > .title').on('click', e => {
    $(e.target).siblings('.anchors').slideToggle()
  })
}

function handleScrollTo() {
  $('.sidenav-chapter .anchor').on('click', e => {
    e.preventDefault()
    const target = $(e.target).attr('href').substr(1)
    history.pushState(null, null, `#${target}`)
    document.getElementById(target).scrollIntoView({
      behavior: 'smooth',
      inline: 'nearest',
      block: 'nearest'
    })
  })
}

function ScrollTracker(onChange) {
  const sections = document.querySelectorAll('.docs-section > section')
  const setActive = (activeSection) => {
    this.active = activeSection
    onChange({ activeSection })
  }
  setActive(sections[0].id)

  $(document).on('scroll', () => {
    const { section: { id } } = getDominant([...sections])
    if (id) {
      onChange({ activeSection: id })
    }
  })
}

function updateDom({ activeSection }) {
  if (!activeSection) return
  const $anchor = $(`.docs-nav [href="#${activeSection}"]`)
  const $parent = $anchor.parent()
  $('.sidenav-chapter > .anchors > .anchor').removeClass('-active')
  $anchor.addClass('-active')
  $parent.slideDown()
}

function getDominant(sections) {
  return sections.reduce((largest, section) => {
    const visibleArea = getVisible($(section))
    return visibleArea > largest.visibleArea
      ? { section, visibleArea }
      : largest
  }, { sections: sections[0], visibleArea: 0 })
}

function getVisible($el) {
  const scrollTop = $(window).scrollTop(),
    elHeight = $el.outerHeight(),
    scrollBot = scrollTop + $(window).height(),
    elTop = $el.offset().top,
    elBottom = elTop + elHeight,
    visibleTop = elTop < scrollTop ? scrollTop : elTop,
    visibleBottom = elBottom > scrollBot ? scrollBot : elBottom,
    visiblePx = Math.max(visibleBottom - visibleTop, 0)
  return visiblePx > 0 ? (visiblePx / elHeight) * 100 : 0
}
