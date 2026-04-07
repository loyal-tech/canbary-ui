/*-----------------------------------*/
/*	SIDEBAR NAVIGATION
/*----------------------------------*/
$(document).ready(function () {
  // Check if there's an active submenu link stored in localStorage
  var activeSubLink = localStorage.getItem("activeSubmenuLink");

  // Reset all states first
  $(".sidebar .collapse").removeClass("show").css({ height: "0", display: "none" });
  $(".sidebar a[data-toggle='collapse']")
    .removeClass("active")
    .addClass("collapsed")
    .attr("aria-expanded", "false");
  $(".sidebar .collapse li a").removeClass("active");

  if (activeSubLink) {
    var $link = $('.sidebar .collapse li a[href="' + activeSubLink + '"]');
    if ($link.length > 0) {
      // Make the link active
      $link.addClass("active");

      // Expand the parent collapses
      $link.parents(".collapse").addClass("show").css({ height: "auto", display: "block" });

      // Activate all parent toggle links
      $link.parents(".collapse").each(function () {
        var $parentToggle = $(this).siblings('a[data-toggle="collapse"]');
        $parentToggle.addClass("active").attr("aria-expanded", "true").removeClass("collapsed");
      });

      // Scroll to the active link
      setTimeout(() => {
        $link[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 10);
    }
  }

  // MAIN MENU MODULE TOGGLE
  $(".sidebar a[data-toggle='collapse']").on("click", function (e) {
    e.preventDefault();
    var $this = $(this);
    var target = $this.attr("href");
    var isOpen = $this.attr("aria-expanded") === "true";

    // Collapse all others
    $(".sidebar a[data-toggle='collapse']")
      .not($this)
      .addClass("collapsed")
      .removeClass("active")
      .attr("aria-expanded", "false");

    $(".sidebar .collapse")
      .not($(target))
      .removeClass("show")
      .css({ height: "0", display: "none" });

    // Toggle this one
    if (isOpen) {
      $this.addClass("collapsed").removeClass("active").attr("aria-expanded", "false");
      $(target).removeClass("show").css({ height: "0", display: "none" });
    } else {
      $this.removeClass("collapsed").addClass("active").attr("aria-expanded", "true");
      $(target).addClass("show").css({ height: "auto", display: "block" });
    }
  });

  // SUBMENU CLICK (including nested)
  $(".sidebar .collapse li a").on("click", function (e) {
    e.stopPropagation(); // Prevent bubbling to parent toggle

    const $link = $(this);
    const href = $link.attr("href");

    // Remove active state from all links
    $(".sidebar .collapse li a").removeClass("active");

    // Add active to clicked link
    $link.addClass("active");

    // Store active link in localStorage
    localStorage.setItem("activeSubmenuLink", href);

    // Get all parent collapses of clicked link
    const $parentsToKeepOpen = $link.parents(".collapse");

    // Close all collapses that are NOT in parent chain
    $(".sidebar .collapse").each(function () {
      const $this = $(this);
      if (!$parentsToKeepOpen.is($this) && $parentsToKeepOpen.has($this).length === 0) {
        $this.removeClass("show").css({ height: "0", display: "none" });
        const $toggle = $this.siblings("a[data-toggle='collapse']");
        $toggle.removeClass("active").addClass("collapsed").attr("aria-expanded", "false");
      }
    });

    // Expand all parent collapses of the clicked link
    $parentsToKeepOpen.addClass("show").css({ height: "auto", display: "block" });

    // Activate all parent toggle links
    $parentsToKeepOpen.each(function () {
      const $toggle = $(this).siblings("a[data-toggle='collapse']");
      $toggle.addClass("active").attr("aria-expanded", "true").removeClass("collapsed");
    });
  });

  // Dashboard or non-collapse items
  $(".sidebar > ul > li > a:not([data-toggle='collapse']), .sidebar .dashboard-link").on(
    "click",
    function () {
      $(".sidebar .collapse").removeClass("show").css({ height: "0", display: "none" });
      $(".sidebar a[data-toggle='collapse']")
        .removeClass("active")
        .addClass("collapsed")
        .attr("aria-expanded", "false");
      $(".sidebar .collapse li a").removeClass("active");
      localStorage.removeItem("activeSubmenuLink");
    }
  );

  // Handle extra menu clicks for non-collapse items (like Dashboard link)
  $(".sidebar > ul > li > a:not([data-toggle='collapse'])").on("click", function () {
    $(".sidebar .collapse").removeClass("show").css({ height: "0", display: "none" });
    $(".sidebar .collapse li a").removeClass("active");
    $(".sidebar a[data-toggle='collapse']")
      .removeClass("active")
      .addClass("collapsed")
      .attr("aria-expanded", "false");

    localStorage.removeItem("activeSubmenuLink");
  });

  // Handle clicks on the dashboard link
  $(".sidebar .dashboard-link").on("click", function () {
    $(".sidebar .collapse").removeClass("show").css({ height: "0", display: "none" });
    $(".sidebar a[data-toggle='collapse']")
      .removeClass("active")
      .addClass("collapsed")
      .attr("aria-expanded", "false");
    $(".sidebar .collapse li a").removeClass("active");
    localStorage.removeItem("activeSubmenuLink");
  });
  // });

  /*-----------------------------------/
	/*	PANEL FUNCTIONS
	/*----------------------------------*/

  // panel remove
  $(".panel .btn-remove").click(function (e) {
    e.preventDefault();
    $(this)
      .parents(".panel")
      .fadeOut(300, function () {
        $(this).remove();
      });
  });

  // toggle function
  $.fn.clickToggle = function (f1, f2) {
    return this.each(function () {
      var clicked = false;
      $(this).bind("click", function () {
        if (clicked) {
          clicked = false;
          return f2.apply(this, arguments);
        }

        clicked = true;
        return f1.apply(this, arguments);
      });
    });
  };

  //  ****************************
  $(document).ready(function () {
    var affectedElement = $(".panel-body");
    $(".panel .btn-toggle-collapse").click(function (e) {
      e.preventDefault();
      var icon = $(this).find("i.fa");
      // Toggle classes based on the current icon class
      if (icon.hasClass("fa-minus-circle")) {
        icon.removeClass("fa-minus-circle").addClass("fa-plus-circle");
      } else {
        icon.removeClass("fa-plus-circle").addClass("fa-minus-circle");
      }
      // Toggle the visibility of the target element
      var target = $(this).data("target");
      $(target).slideToggle(300);
    });
  });

  // ***********************
  $(document).ready(function () {
    var affectedElement = $(".panel-body");

    $(".panel .btn-toggle-collapse").on("click", function (e) {
      e.preventDefault();
      var panel = $(this).parents(".panel");

      // Check if it has scroll
      if (panel.find(".slimScrollDiv").length > 0) {
        affectedElement = panel.find(".slimScrollDiv");
      }

      affectedElement.slideToggle(300);
      $(this).find("i").toggleClass("fa-minus-circle fa-plus"); // Toggle icon classes correctly
    });
  });

  $(document).ready(function () {
    var affectedElement = $(".panel-body");
    $(".panel .btn-toggle-collapse").clickToggle(
      function (e) {
        e.preventDefault();
        // if has scroll
        if ($(this).parents(".panel").find(".slimScrollDiv").length > 0) {
          affectedElement = $(".slimScrollDiv");
        }
        $(this).parents(".panel").find(affectedElement).slideUp(300);
        $(this).find("i.fa-minus-circle").toggleClass("fa-plus");
      },
      function (e) {
        e.preventDefault();
        // if has scroll
        if ($(this).parents(".panel").find(".slimScrollDiv").length > 0) {
          affectedElement = $(".slimScrollDiv");
        }
        $(this).parents(".panel").find(affectedElement).slideDown(300);
        $(this).find("i.fa-minus-circle").toggleClass("fa-plus");
      }
    );
  });

  /*-----------------------------------/
	/*	PANEL SCROLLING
	/*----------------------------------*/

  if ($(".panel-scrolling").length > 0) {
    $(".panel-scrolling .panel-body").slimScroll({
      height: "430px",
      wheelStep: 2
    });
  }

  if ($("#panel-scrolling-demo").length > 0) {
    $("#panel-scrolling-demo .panel-body").slimScroll({
      height: "175px",
      wheelStep: 2
    });
  }

  /*-----------------------------------/
	/*	TODO LIST
	/*----------------------------------*/

  $(".todo-list input").change(function () {
    if ($(this).prop("checked")) {
      $(this).parents("li").addClass("completed");
    } else {
      $(this).parents("li").removeClass("completed");
    }
  });

  /*-----------------------------------/
	/* TOASTR NOTIFICATION
	/*----------------------------------*/

  if ($("#toastr-demo").length > 0) {
    toastr.options.timeOut = "false";
    toastr.options.closeButton = true;
    toastr["info"](
      'Hi there, this is notification demo with HTML support. So, you can add HTML elements like <a href="#">this link</a>'
    );

    $(".btn-toastr").on("click", function () {
      $context = $(this).data("context");
      $message = $(this).data("message");
      $position = $(this).data("position");

      if ($context == "") {
        $context = "info";
      }

      if ($position == "") {
        $positionClass = "toast-left-top";
      } else {
        $positionClass = "toast-" + $position;
      }

      toastr.remove();
      toastr[$context]($message, "", { positionClass: $positionClass });
    });

    $("#toastr-callback1").on("click", function () {
      $message = $(this).data("message");

      toastr.options = {
        timeOut: "300",
        onShown: function () {
          alert("onShown callback");
        },
        onHidden: function () {
          alert("onHidden callback");
        }
      };

      toastr["info"]($message);
    });

    $("#toastr-callback2").on("click", function () {
      $message = $(this).data("message");

      toastr.options = {
        timeOut: "10000",
        onclick: function () {
          alert("onclick callback");
        }
      };

      toastr["info"]($message);
    });

    $("#toastr-callback3").on("click", function () {
      $message = $(this).data("message");

      toastr.options = {
        timeOut: "10000",
        closeButton: true,
        onCloseClick: function () {
          alert("onCloseClick callback");
        }
      };

      toastr["info"]($message);
    });
  }
});
