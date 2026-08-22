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

  const getCellValue = (row, index) => {
    const cell = row.c[index]
    return cell ? String(cell.f || cell.v || '').trim() : ''
  }

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
      const title = titleIndex >= 0 ? row[titleIndex] : '最新消息'
      const content = contentIndex >= 0 ? row[contentIndex] : (titleIndex >= 0 ? row[1] : firstValue)
      const date = dateIndex >= 0 ? row[dateIndex] : ''
      const link = linkIndex >= 0 ? row[linkIndex] : ''
      const article = document.createElement('article')
      article.className = 'news-item'

      const header = document.createElement('div')
      header.className = 'news-item-header'
      const heading = document.createElement('h3')
      appendLinkedText(heading, title || '最新消息')
      header.appendChild(heading)
      if (date) {
        const dateElement = document.createElement('time')
        dateElement.className = 'news-date'
        dateElement.textContent = date
        header.appendChild(dateElement)
      }
      article.appendChild(header)

      if (content && content !== title) {
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
    fetch(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`)
      .then(response => {
        if (!response.ok) throw new Error('Unable to load spreadsheet')
        return response.text()
      })
      .then(text => {
        const json = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1))
        renderNews(json.table)
      })
      .catch(() => {
        newsList.innerHTML = '<p class="news-status">最新消息暫時無法載入，請稍後再試。</p>'
      })
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
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
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
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 20
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
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
    onscroll(document, headerScrolled)
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
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

})()