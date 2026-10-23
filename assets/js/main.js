/**
* Template Name: Amoeba
* Updated: Jan 09 2024 with Bootstrap v5.3.2
* Template URL: https://bootstrapmade.com/free-one-page-bootstrap-template-amoeba/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  const experienceYears = document.querySelector('#experience-years')
  if (experienceYears) {
    const careerStartYear = 2009
    const yearsOfExperience = Math.max(0, new Date().getFullYear() - careerStartYear)
    experienceYears.textContent = `${yearsOfExperience} 年`
  }

  const newsList = document.querySelector('#news-list')
  const spreadsheetId = '1GN_7eX-07mccx-sPt2pxHjZEfO5RwX29tFRjSFhM4As'

  const findColumn = (headers, names) => headers.findIndex(header =>
    names.some(name => header.toLowerCase().includes(name))
  )

  const appendLinkedText = (element, text) => {
    const linkPattern = /<a\s+href=["'](https?:\/\/[^"']+)["']>([^<>]*)<\/a>|<a>(https?:\/\/[^<>\s]+)<\/a>|<(https?:\/\/[^<>\s]+)>/gi
    let lastIndex = 0
    let match

    while ((match = linkPattern.exec(text)) !== null) {
      element.appendChild(document.createTextNode(text.slice(lastIndex, match.index)))
      const href = match[1] || match[3] || match[4]
      const label = match[2] || match[3] || match[4]
      const linkElement = document.createElement('a')
      linkElement.className = 'news-inline-link'
      linkElement.href = href
      linkElement.target = '_blank'
      linkElement.rel = 'noopener'
      linkElement.textContent = label
      element.appendChild(linkElement)
      lastIndex = linkPattern.lastIndex
    }

    element.appendChild(document.createTextNode(text.slice(lastIndex)))
  }

  const renderNews = (table) => {
    const headers = table.cols.map(column => String(column.label || '').trim())
    const titleIndex = findColumn(headers, ['標題', 'title', '主旨'])
    const contentIndex = findColumn(headers, ['內容', 'content', '訊息', '公告', 'description'])
    const dateIndex = findColumn(headers, ['日期', 'date', '時間', '發布'])
    const linkIndex = findColumn(headers, ['連結', 'link', 'url'])
    const rows = table.rows
      .map(row => row.c.map(cell => String(cell?.f || cell?.v || '').trim()))
      .filter(row => row.some(Boolean))

    newsList.replaceChildren()
    if (!rows.length) {
      newsList.innerHTML = '<p class="news-status">目前沒有最新消息。</p>'
      return
    }

    rows.forEach(row => {
      const firstValue = row.find(Boolean) || ''
      const rawTitle = titleIndex >= 0 ? row[titleIndex] : ''
      const rawContent = contentIndex >= 0 ? row[contentIndex] : firstValue
      const contentLines = rawContent.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
      let title = rawTitle || contentLines.shift() || ''
      if (title === '最新消息') title = contentLines.shift() || ''
      if (contentLines[0] === '最新消息' || contentLines[0] === title) contentLines.shift()
      const content = contentLines.join('\n')
      const date = dateIndex >= 0 ? row[dateIndex] : ''
      const link = linkIndex >= 0 ? row[linkIndex] : ''

      if (!title && !content) return

      const article = document.createElement('article')
      article.className = 'news-item'

      const header = document.createElement('div')
      header.className = 'news-item-header'
      const heading = document.createElement('h3')
      appendLinkedText(heading, title)
      header.appendChild(heading)
      if (date) {
        const dateElement = document.createElement('time')
        dateElement.className = 'news-date'
        dateElement.textContent = date
        header.appendChild(dateElement)
      }
      article.appendChild(header)

      if (content) {
        const contentElement = document.createElement('p')
        contentElement.className = 'news-content'
        appendLinkedText(contentElement, content)
        article.appendChild(contentElement)
      }

      if (/^https?:\/\//i.test(link)) {
        const linkElement = document.createElement('a')
        linkElement.className = 'news-link'
        linkElement.href = link
        linkElement.target = '_blank'
        linkElement.rel = 'noopener'
        linkElement.textContent = '查看詳情 →'
        article.appendChild(linkElement)
      }
      newsList.appendChild(article)
    })
  }

  if (newsList) {
    const callbackName = `veckyNewsCallback_${Date.now()}`
    const script = document.createElement('script')
    const timeout = window.setTimeout(() => script.onerror(), 12000)

    window[callbackName] = response => {
      window.clearTimeout(timeout)
      delete window[callbackName]
      script.remove()

      if (response?.status === 'ok' && response.table) {
        renderNews(response.table)
      } else {
        newsList.innerHTML = '<p class="news-status">最新消息暫時無法載入，請稍後再試。</p>'
      }
    }

    script.onerror = () => {
      window.clearTimeout(timeout)
      delete window[callbackName]
      script.remove()
      newsList.innerHTML = '<p class="news-status">最新消息暫時無法載入，請稍後再試。</p>'
    }
    script.src = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=${encodeURIComponent(`out:json;responseHandler:${callbackName}`)}`
    document.head.appendChild(script)
  }

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(window, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight
    let element = select(el)
    let elementPos = element.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: Math.max(0, elementPos - offset),
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(window, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(window, toggleBacktotop)
  }

  const navbar = select('#navbar')
  const navbarToggle = select('.mobile-nav-toggle')
  const menuIcon = select('.menu-icon')

  const closeMobileNav = () => {
    if (!navbar || !navbar.classList.contains('navbar-mobile')) return
    navbar.classList.remove('navbar-mobile')
    navbarToggle.setAttribute('aria-expanded', 'false')
    navbarToggle.setAttribute('aria-label', '開啟導覽選單')
    menuIcon.textContent = '☰'
  }

  if (navbar && navbarToggle) {
    navbarToggle.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('navbar-mobile')
      navbarToggle.setAttribute('aria-expanded', String(isOpen))
      navbarToggle.setAttribute('aria-label', isOpen ? '關閉導覽選單' : '開啟導覽選單')
      menuIcon.textContent = isOpen ? '×' : '☰'
    })
  }

  document.querySelectorAll('a.scrollto').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.getElementById(link.hash.slice(1))
      if (!target) return
      event.preventDefault()
      closeMobileNav()
      scrollto(`#${target.id}`)
    })
  })

  window.addEventListener('load', () => {
    const targetId = window.location.hash.slice(1)
    if (targetId && document.getElementById(targetId)) {
      scrollto(`#${targetId}`)
    }
  })

  document.querySelectorAll('[data-faq-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const answer = document.getElementById(button.dataset.faqToggle)
      if (!answer) return

      const willOpen = answer.hidden
      document.querySelectorAll('[data-faq-toggle]').forEach(otherButton => {
        const otherAnswer = document.getElementById(otherButton.dataset.faqToggle)
        otherButton.setAttribute('aria-expanded', 'false')
        otherButton.classList.add('collapsed')
        if (otherAnswer) otherAnswer.hidden = true
      })

      if (willOpen) {
        answer.hidden = false
        button.setAttribute('aria-expanded', 'true')
        button.classList.remove('collapsed')
      }
    })
  })

  const galleryLinks = [...document.querySelectorAll('.portfolio-lightbox')]
  if (galleryLinks.length) {
    const dialog = document.createElement('dialog')
    dialog.className = 'lightbox-dialog'
    dialog.setAttribute('aria-label', '作品照片檢視器')

    const image = document.createElement('img')
    const closeButton = document.createElement('button')
    closeButton.className = 'lightbox-close'
    closeButton.type = 'button'
    closeButton.setAttribute('aria-label', '關閉照片')
    closeButton.textContent = '×'

    const previousButton = document.createElement('button')
    previousButton.className = 'lightbox-previous'
    previousButton.type = 'button'
    previousButton.setAttribute('aria-label', '上一張作品')
    previousButton.textContent = '‹'

    const nextButton = document.createElement('button')
    nextButton.className = 'lightbox-next'
    nextButton.type = 'button'
    nextButton.setAttribute('aria-label', '下一張作品')
    nextButton.textContent = '›'
    dialog.append(image, closeButton, previousButton, nextButton)
    document.body.appendChild(dialog)

    let activeImage = 0
    const showImage = index => {
      activeImage = (index + galleryLinks.length) % galleryLinks.length
      const link = galleryLinks[activeImage]
      image.src = link.href
      image.alt = link.closest('.portfolio-wrap')?.querySelector('img')?.alt || '髮型作品'
    }

    galleryLinks.forEach((link, index) => {
      link.addEventListener('click', event => {
        event.preventDefault()
        showImage(index)
        dialog.showModal()
        closeButton.focus()
      })
    })

    closeButton.addEventListener('click', () => dialog.close())
    previousButton.addEventListener('click', () => showImage(activeImage - 1))
    nextButton.addEventListener('click', () => showImage(activeImage + 1))
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close()
    })
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') showImage(activeImage - 1)
      if (event.key === 'ArrowRight') showImage(activeImage + 1)
    })
  }

})()