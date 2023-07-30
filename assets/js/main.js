;(function ($) {
  var $window = $(window),
    $body = $('body'),
    $wrapper = $('#wrapper'),
    $header = $('#header'),
    $footer = $('#footer'),
    $main = $('#main'),
    $main_articles = $main.children('article')

  // Breakpoints.
  breakpoints({
    xlarge: ['1281px', '1680px'],
    large: ['981px', '1280px'],
    medium: ['737px', '980px'],
    small: ['481px', '736px'],
    xsmall: ['361px', '480px'],
    xxsmall: [null, '360px'],
  })

  // Play initial animations on page load.
  $window.on('load', function () {
    window.setTimeout(function () {
      $body.removeClass('is-preload')
    }, 100)
  })

  // FIX: Flexbox min-height bug on IE.
  if (browser.name == 'ie') {
    var flexboxFixTimeoutId

    $window
      .on('resize.flexbox-fix', function () {
        clearTimeout(flexboxFixTimeoutId)

        flexboxFixTimeoutId = setTimeout(function () {
          if ($wrapper.prop('scrollHeight') > $window.height())
            $wrapper.css('height', 'auto')
          else $wrapper.css('height', '100vh')
        }, 250)
      })
      .triggerHandler('resize.flexbox-fix')
  }

  // Nav.
  var $nav = $header.children('nav'),
    $nav_li = $nav.find('li')

  // Add "middle" alignment classes if we're dealing with an even number of items.
  if ($nav_li.length % 2 == 0) {
    $nav.addClass('use-middle')
    $nav_li.eq($nav_li.length / 2).addClass('is-middle')
  }

  // Main.
  var delay = 325,
    locked = false

  // Methods.
  $main._show = function (id, initial) {
    var $article = $main_articles.filter('#' + id)

    // No such article? Bail.
    if ($article.length == 0) return

    // Handle lock.

    // Already locked? Speed through "show" steps w/o delays.
    if (locked || (typeof initial != 'undefined' && initial === true)) {
      // Mark as switching.
      $body.addClass('is-switching')

      // Mark as visible.
      $body.addClass('is-article-visible')

      // Deactivate all articles (just in case one's already active).
      $main_articles.removeClass('active')

      // Hide header, footer.
      $header.hide()
      $footer.hide()

      // Show main, article.
      $main.show()
      $article.show()

      // Activate article.
      $article.addClass('active')

      // Unlock.
      locked = false

      // Unmark as switching.
      setTimeout(
        function () {
          $body.removeClass('is-switching')
        },
        initial ? 1000 : 0,
      )

      return
    }

    // Lock.
    locked = true

    // Article already visible? Just swap articles.
    if ($body.hasClass('is-article-visible')) {
      // Deactivate current article.
      var $currentArticle = $main_articles.filter('.active')

      $currentArticle.removeClass('active')

      // Show article.
      setTimeout(function () {
        // Hide current article.
        $currentArticle.hide()

        // Show article.
        $article.show()

        // Activate article.
        setTimeout(function () {
          $article.addClass('active')

          // Window stuff.
          $window.scrollTop(0).triggerHandler('resize.flexbox-fix')

          // Unlock.
          setTimeout(function () {
            locked = false
          }, delay)
        }, 25)
      }, delay)
    }

    // Otherwise, handle as normal.
    else {
      // Mark as visible.
      $body.addClass('is-article-visible')

      // Show article.
      setTimeout(function () {
        // Hide header, footer.
        $header.hide()
        $footer.hide()

        // Show main, article.
        $main.show()
        $article.show()

        // Activate article.
        setTimeout(function () {
          $article.addClass('active')

          // Window stuff.
          $window.scrollTop(0).triggerHandler('resize.flexbox-fix')

          // Unlock.
          setTimeout(function () {
            locked = false
          }, delay)
        }, 25)
      }, delay)
    }
  }

  $main._hide = function (addState) {
    var $article = $main_articles.filter('.active')

    // Article not visible? Bail.
    if (!$body.hasClass('is-article-visible')) return

    // Add state?
    if (typeof addState != 'undefined' && addState === true)
      history.pushState(null, null, '#')

    // Handle lock.

    // Already locked? Speed through "hide" steps w/o delays.
    if (locked) {
      // Mark as switching.
      $body.addClass('is-switching')

      // Deactivate article.
      $article.removeClass('active')

      // Hide article, main.
      $article.hide()
      $main.hide()

      // Show footer, header.
      $footer.show()
      $header.show()

      // Unmark as visible.
      $body.removeClass('is-article-visible')

      // Unlock.
      locked = false

      // Unmark as switching.
      $body.removeClass('is-switching')

      // Window stuff.
      $window.scrollTop(0).triggerHandler('resize.flexbox-fix')

      return
    }

    // Lock.
    locked = true

    // Deactivate article.
    $article.removeClass('active')

    // Hide article.
    setTimeout(function () {
      // Hide article, main.
      $article.hide()
      $main.hide()

      // Show footer, header.
      $footer.show()
      $header.show()

      // Unmark as visible.
      setTimeout(function () {
        $body.removeClass('is-article-visible')

        // Window stuff.
        $window.scrollTop(0).triggerHandler('resize.flexbox-fix')

        // Unlock.
        setTimeout(function () {
          locked = false
        }, delay)
      }, 25)
    }, delay)
  }

  // Articles.
  $main_articles.each(function () {
    var $this = $(this)

    // Close.
    $('<div class="close">Close</div>')
      .appendTo($this)
      .on('click', function () {
        location.hash = ''
      })

    // Prevent clicks from inside article from bubbling.
    $this.on('click', function (event) {
      event.stopPropagation()
    })
  })

  // Events.
  $body.on('click', function (event) {
    // Article visible? Hide.
    if ($body.hasClass('is-article-visible')) $main._hide(true)
  })

  $window.on('keyup', function (event) {
    switch (event.keyCode) {
      case 27:
        // Article visible? Hide.
        if ($body.hasClass('is-article-visible')) $main._hide(true)

        break

      default:
        break
    }
  })

  $window.on('hashchange', function (event) {
    // Empty hash?
    if (location.hash == '' || location.hash == '#') {
      // Prevent default.
      event.preventDefault()
      event.stopPropagation()

      // Hide.
      $main._hide()
    }

    // Otherwise, check for a matching article.
    else if ($main_articles.filter(location.hash).length > 0) {
      // Prevent default.
      event.preventDefault()
      event.stopPropagation()

      // Show article.
      $main._show(location.hash.substr(1))
    }
  })

  // Scroll restoration.
  // This prevents the page from scrolling back to the top on a hashchange.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  else {
    var oldScrollPos = 0,
      scrollPos = 0,
      $htmlbody = $('html,body')

    $window
      .on('scroll', function () {
        oldScrollPos = scrollPos
        scrollPos = $htmlbody.scrollTop()
      })
      .on('hashchange', function () {
        $window.scrollTop(oldScrollPos)
      })
  }

  // Initialize.

  // Hide main, articles.
  $main.hide()
  $main_articles.hide()

  // Initial article.
  if (location.hash != '' && location.hash != '#')
    $window.on('load', function () {
      $main._show(location.hash.substr(1), true)
    })
})(jQuery)

// Function to trigger the typing animation
function startTypingAnimation() {
  const elements = document.querySelectorAll('.inner h1, .inner p')
  elements.forEach((el) => {
    el.style.animationPlayState = 'running'
  })
}

// Start the typing animation when the page loads
window.addEventListener('load', () => {
  startTypingAnimation()
})

document.addEventListener('DOMContentLoaded', function () {
  // Projects search
  const projectsContainer = document.getElementById('projectList')
  const searchInput = document.getElementById('searchInput')

  searchInput.addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase().trim()
    const projects = projectsContainer.getElementsByClassName('project-item')

    for (const project of projects) {
      const projectName = project
        .querySelector('.major')
        .textContent.toLowerCase()

      if (projectName.includes(searchTerm)) {
        project.style.display = 'block'
      } else {
        project.style.display = 'none'
      }
    }
  })

  // Blogs search
  const blogsContainer = document.getElementById('blogs')
  const searchBlogInput = document.getElementById('searchBlogInput')

  searchBlogInput.addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase().trim()
    const blogPosts = blogsContainer.getElementsByClassName('blog-post')

    for (const post of blogPosts) {
      const blogTitle = post.querySelector('h3').textContent.toLowerCase()

      if (blogTitle.includes(searchTerm)) {
        post.style.display = 'block'
      } else {
        post.style.display = 'none'
      }
    }
  })
  const navItems = document.querySelectorAll('#header nav ul li a')

  // Function to focus the next or previous navigation item
  function focusNavItem(next) {
    const currentFocus = document.activeElement
    let currentIndex = Array.from(navItems).indexOf(currentFocus)

    if (next) {
      currentIndex = (currentIndex + 1) % navItems.length
    } else {
      currentIndex = (currentIndex - 1 + navItems.length) % navItems.length
    }

    navItems[currentIndex].focus()
  }

  // Handle keyboard events for navigation
  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      focusNavItem(false) // Focus the previous navigation item
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      focusNavItem(true) // Focus the next navigation item
    }
  })
})
// Initialize the carousels after the DOM is ready
$(document).ready(function () {
  $('#tech-stack-carousel').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  })

  $('#tools-carousel').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  })
})

// // Get the current year
// const currentYear = new Date().getFullYear()

// // Update the content of the HTML element with the current year
// document.getElementById(
//   'current-year',
// ).innerText = `${currentYear} Alexis Corporal. All rights reserved`
