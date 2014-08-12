




<!DOCTYPE html>
<html lang="en" class="   ">
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# object: http://ogp.me/ns/object# article: http://ogp.me/ns/article# profile: http://ogp.me/ns/profile#">
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="en">
    
    
    <title>backbone-events-standalone/README.md at master · n1k0/backbone-events-standalone · GitHub</title>
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub">
    <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub">
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-114.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-144.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144.png">
    <meta property="fb:app_id" content="1401488693436528">

      <meta content="@github" name="twitter:site" /><meta content="summary" name="twitter:card" /><meta content="n1k0/backbone-events-standalone" name="twitter:title" /><meta content="backbone-events-standalone - Standalone, minimal version of Backbone.Events" name="twitter:description" /><meta content="https://avatars3.githubusercontent.com/u/41547?v=2&amp;s=400" name="twitter:image:src" />
<meta content="GitHub" property="og:site_name" /><meta content="object" property="og:type" /><meta content="https://avatars3.githubusercontent.com/u/41547?v=2&amp;s=400" property="og:image" /><meta content="n1k0/backbone-events-standalone" property="og:title" /><meta content="https://github.com/n1k0/backbone-events-standalone" property="og:url" /><meta content="backbone-events-standalone - Standalone, minimal version of Backbone.Events" property="og:description" />

    <link rel="assets" href="https://assets-cdn.github.com/">
    <link rel="conduit-xhr" href="https://ghconduit.com:25035">
    

    <meta name="msapplication-TileImage" content="/windows-tile.png">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="selected-link" value="repo_source" data-pjax-transient>
      <meta name="google-analytics" content="UA-3769691-2">

    <meta content="collector.githubapp.com" name="octolytics-host" /><meta content="collector-cdn.github.com" name="octolytics-script-host" /><meta content="github" name="octolytics-app-id" /><meta content="A2F3F65C:7B5C:256736F:53E81C0A" name="octolytics-dimension-request_id" />
    

    
    
    <link rel="icon" type="image/x-icon" href="https://assets-cdn.github.com/favicon.ico">


    <meta content="authenticity_token" name="csrf-param" />
<meta content="4n4gcsz56LwlqJDIZIKlcQlAhPLMXUZ3gn5nIhPmowyboBWI4EiGJ6x2EhrV9KP+vqSHlTX3AidEyReugTJ1Fw==" name="csrf-token" />

    <link href="https://assets-cdn.github.com/assets/github-552c62186b3c4c8234a6c1e644620db9c279e080.css" media="all" rel="stylesheet" type="text/css" />
    <link href="https://assets-cdn.github.com/assets/github2-b855c0b37e346d3dac214385acbf7f00a78096db.css" media="all" rel="stylesheet" type="text/css" />
    


    <meta http-equiv="x-pjax-version" content="578b163ff171518e5f8a90209edf4732">

      
  <meta name="description" content="backbone-events-standalone - Standalone, minimal version of Backbone.Events">


  <meta content="41547" name="octolytics-dimension-user_id" /><meta content="n1k0" name="octolytics-dimension-user_login" /><meta content="12620189" name="octolytics-dimension-repository_id" /><meta content="n1k0/backbone-events-standalone" name="octolytics-dimension-repository_nwo" /><meta content="true" name="octolytics-dimension-repository_public" /><meta content="false" name="octolytics-dimension-repository_is_fork" /><meta content="12620189" name="octolytics-dimension-repository_network_root_id" /><meta content="n1k0/backbone-events-standalone" name="octolytics-dimension-repository_network_root_nwo" />

  <link href="https://github.com/n1k0/backbone-events-standalone/commits/master.atom" rel="alternate" title="Recent Commits to backbone-events-standalone:master" type="application/atom+xml">

  </head>


  <body class="logged_out  env-production  vis-public page-blob">
    <a href="#start-of-content" tabindex="1" class="accessibility-aid js-skip-to-content">Skip to content</a>
    <div class="wrapper">
      
      
      
      


      
      <div class="header header-logged-out">
  <div class="container clearfix">

    <a class="header-logo-wordmark" href="https://github.com/">
      <span class="mega-octicon octicon-logo-github"></span>
    </a>

    <div class="header-actions">
        <a class="button primary" href="/join">Sign up</a>
      <a class="button signin" href="/login?return_to=%2Fn1k0%2Fbackbone-events-standalone%2Fblob%2Fmaster%2FREADME.md">Sign in</a>
    </div>

    <div class="command-bar js-command-bar  in-repository">

      <ul class="top-nav">
          <li class="explore"><a href="/explore">Explore</a></li>
          <li class="features"><a href="/features">Features</a></li>
          <li class="enterprise"><a href="https://enterprise.github.com/">Enterprise</a></li>
          <li class="blog"><a href="/blog">Blog</a></li>
      </ul>
        <form accept-charset="UTF-8" action="/search" class="command-bar-form" id="top_search_form" method="get">

<div class="commandbar">
  <span class="message"></span>
  <input type="text" data-hotkey="s, /" name="q" id="js-command-bar-field" placeholder="Search or type a command" tabindex="1" autocapitalize="off"
    
    
    data-repo="n1k0/backbone-events-standalone"
  >
  <div class="display hidden"></div>
</div>

    <input type="hidden" name="nwo" value="n1k0/backbone-events-standalone">

    <div class="select-menu js-menu-container js-select-menu search-context-select-menu">
      <span class="minibutton select-menu-button js-menu-target" role="button" aria-haspopup="true">
        <span class="js-select-button">This repository</span>
      </span>

      <div class="select-menu-modal-holder js-menu-content js-navigation-container" aria-hidden="true">
        <div class="select-menu-modal">

          <div class="select-menu-item js-navigation-item js-this-repository-navigation-item selected">
            <span class="select-menu-item-icon octicon octicon-check"></span>
            <input type="radio" class="js-search-this-repository" name="search_target" value="repository" checked="checked">
            <div class="select-menu-item-text js-select-button-text">This repository</div>
          </div> <!-- /.select-menu-item -->

          <div class="select-menu-item js-navigation-item js-all-repositories-navigation-item">
            <span class="select-menu-item-icon octicon octicon-check"></span>
            <input type="radio" name="search_target" value="global">
            <div class="select-menu-item-text js-select-button-text">All repositories</div>
          </div> <!-- /.select-menu-item -->

        </div>
      </div>
    </div>

  <span class="help tooltipped tooltipped-s" aria-label="Show command bar help">
    <span class="octicon octicon-question"></span>
  </span>


  <input type="hidden" name="ref" value="cmdform">

</form>
    </div>

  </div>
</div>



      <div id="start-of-content" class="accessibility-aid"></div>
          <div class="site" itemscope itemtype="http://schema.org/WebPage">
    <div id="js-flash-container">
      
    </div>
    <div class="pagehead repohead instapaper_ignore readability-menu">
      <div class="container">
        
<ul class="pagehead-actions">


  <li>
      <a href="/login?return_to=%2Fn1k0%2Fbackbone-events-standalone"
    class="minibutton with-count star-button tooltipped tooltipped-n"
    aria-label="You must be signed in to star a repository" rel="nofollow">
    <span class="octicon octicon-star"></span>
    Star
  </a>

    <a class="social-count js-social-count" href="/n1k0/backbone-events-standalone/stargazers">
      17
    </a>

  </li>

    <li>
      <a href="/login?return_to=%2Fn1k0%2Fbackbone-events-standalone"
        class="minibutton with-count js-toggler-target fork-button tooltipped tooltipped-n"
        aria-label="You must be signed in to fork a repository" rel="nofollow">
        <span class="octicon octicon-repo-forked"></span>
        Fork
      </a>
      <a href="/n1k0/backbone-events-standalone/network" class="social-count">
        4
      </a>
    </li>
</ul>

        <h1 itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="entry-title public">
          <span class="mega-octicon octicon-repo"></span>
          <span class="author"><a href="/n1k0" class="url fn" itemprop="url" rel="author"><span itemprop="title">n1k0</span></a></span><!--
       --><span class="path-divider">/</span><!--
       --><strong><a href="/n1k0/backbone-events-standalone" class="js-current-repository js-repo-home-link">backbone-events-standalone</a></strong>

          <span class="page-context-loader">
            <img alt="" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
          </span>

        </h1>
      </div><!-- /.container -->
    </div><!-- /.repohead -->

    <div class="container">
      <div class="repository-with-sidebar repo-container new-discussion-timeline  ">
        <div class="repository-sidebar clearfix">
            

<div class="sunken-menu vertical-right repo-nav js-repo-nav js-repository-container-pjax js-octicon-loaders" data-issue-count-url="/n1k0/backbone-events-standalone/issues/counts">
  <div class="sunken-menu-contents">
    <ul class="sunken-menu-group">
      <li class="tooltipped tooltipped-w" aria-label="Code">
        <a href="/n1k0/backbone-events-standalone" aria-label="Code" class="selected js-selected-navigation-item sunken-menu-item" data-hotkey="g c" data-pjax="true" data-selected-links="repo_source repo_downloads repo_commits repo_releases repo_tags repo_branches /n1k0/backbone-events-standalone">
          <span class="octicon octicon-code"></span> <span class="full-word">Code</span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>

        <li class="tooltipped tooltipped-w" aria-label="Issues">
          <a href="/n1k0/backbone-events-standalone/issues" aria-label="Issues" class="js-selected-navigation-item sunken-menu-item js-disable-pjax" data-hotkey="g i" data-selected-links="repo_issues repo_labels repo_milestones /n1k0/backbone-events-standalone/issues">
            <span class="octicon octicon-issue-opened"></span> <span class="full-word">Issues</span>
            <span class="js-issue-replace-counter"></span>
            <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>        </li>

      <li class="tooltipped tooltipped-w" aria-label="Pull Requests">
        <a href="/n1k0/backbone-events-standalone/pulls" aria-label="Pull Requests" class="js-selected-navigation-item sunken-menu-item js-disable-pjax" data-hotkey="g p" data-selected-links="repo_pulls /n1k0/backbone-events-standalone/pulls">
            <span class="octicon octicon-git-pull-request"></span> <span class="full-word">Pull Requests</span>
            <span class="js-pull-replace-counter"></span>
            <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>


    </ul>
    <div class="sunken-menu-separator"></div>
    <ul class="sunken-menu-group">

      <li class="tooltipped tooltipped-w" aria-label="Pulse">
        <a href="/n1k0/backbone-events-standalone/pulse" aria-label="Pulse" class="js-selected-navigation-item sunken-menu-item" data-pjax="true" data-selected-links="pulse /n1k0/backbone-events-standalone/pulse">
          <span class="octicon octicon-pulse"></span> <span class="full-word">Pulse</span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>

      <li class="tooltipped tooltipped-w" aria-label="Graphs">
        <a href="/n1k0/backbone-events-standalone/graphs" aria-label="Graphs" class="js-selected-navigation-item sunken-menu-item" data-pjax="true" data-selected-links="repo_graphs repo_contributors /n1k0/backbone-events-standalone/graphs">
          <span class="octicon octicon-graph"></span> <span class="full-word">Graphs</span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>
    </ul>


  </div>
</div>

              <div class="only-with-full-nav">
                

  

<div class="clone-url open"
  data-protocol-type="http"
  data-url="/users/set_protocol?protocol_selector=http&amp;protocol_type=clone">
  <h3><strong>HTTPS</strong> clone URL</h3>
  <div class="input-group">
    <input type="text" class="input-mini input-monospace js-url-field"
           value="https://github.com/n1k0/backbone-events-standalone.git" readonly="readonly">
    <span class="input-group-button">
      <button aria-label="Copy to clipboard" class="js-zeroclipboard minibutton zeroclipboard-button" data-clipboard-text="https://github.com/n1k0/backbone-events-standalone.git" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
    </span>
  </div>
</div>

  

<div class="clone-url "
  data-protocol-type="subversion"
  data-url="/users/set_protocol?protocol_selector=subversion&amp;protocol_type=clone">
  <h3><strong>Subversion</strong> checkout URL</h3>
  <div class="input-group">
    <input type="text" class="input-mini input-monospace js-url-field"
           value="https://github.com/n1k0/backbone-events-standalone" readonly="readonly">
    <span class="input-group-button">
      <button aria-label="Copy to clipboard" class="js-zeroclipboard minibutton zeroclipboard-button" data-clipboard-text="https://github.com/n1k0/backbone-events-standalone" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
    </span>
  </div>
</div>


<p class="clone-options">You can clone with
      <a href="#" class="js-clone-selector" data-protocol="http">HTTPS</a>
      or <a href="#" class="js-clone-selector" data-protocol="subversion">Subversion</a>.
  <a href="https://help.github.com/articles/which-remote-url-should-i-use" class="help tooltipped tooltipped-n" aria-label="Get help on which URL is right for you.">
    <span class="octicon octicon-question"></span>
  </a>
</p>



                <a href="/n1k0/backbone-events-standalone/archive/master.zip"
                   class="minibutton sidebar-button"
                   aria-label="Download n1k0/backbone-events-standalone as a zip file"
                   title="Download n1k0/backbone-events-standalone as a zip file"
                   rel="nofollow">
                  <span class="octicon octicon-cloud-download"></span>
                  Download ZIP
                </a>
              </div>
        </div><!-- /.repository-sidebar -->

        <div id="js-repo-pjax-container" class="repository-content context-loader-container" data-pjax-container>
          


<a href="/n1k0/backbone-events-standalone/blob/ec09c9acfe6510ba14e8500d7c9bdcf594afc76c/README.md" class="hidden js-permalink-shortcut" data-hotkey="y">Permalink</a>

<!-- blob contrib key: blob_contributors:v21:6d892c554de227dbc11880124f0e625e -->

<div class="file-navigation">
  

<div class="select-menu js-menu-container js-select-menu" >
  <span class="minibutton select-menu-button js-menu-target css-truncate" data-hotkey="w"
    data-master-branch="master"
    data-ref="master"
    title="master"
    role="button" aria-label="Switch branches or tags" tabindex="0" aria-haspopup="true">
    <span class="octicon octicon-git-branch"></span>
    <i>branch:</i>
    <span class="js-select-button css-truncate-target">master</span>
  </span>

  <div class="select-menu-modal-holder js-menu-content js-navigation-container" data-pjax aria-hidden="true">

    <div class="select-menu-modal">
      <div class="select-menu-header">
        <span class="select-menu-title">Switch branches/tags</span>
        <span class="octicon octicon-x js-menu-close" role="button" aria-label="Close"></span>
      </div> <!-- /.select-menu-header -->

      <div class="select-menu-filters">
        <div class="select-menu-text-filter">
          <input type="text" aria-label="Filter branches/tags" id="context-commitish-filter-field" class="js-filterable-field js-navigation-enable" placeholder="Filter branches/tags">
        </div>
        <div class="select-menu-tabs">
          <ul>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="branches" class="js-select-menu-tab">Branches</a>
            </li>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="tags" class="js-select-menu-tab">Tags</a>
            </li>
          </ul>
        </div><!-- /.select-menu-tabs -->
      </div><!-- /.select-menu-filters -->

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="branches">

        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <div class="select-menu-item js-navigation-item selected">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/n1k0/backbone-events-standalone/blob/master/README.md"
                 data-name="master"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="master">master</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/n1k0/backbone-events-standalone/blob/testling/README.md"
                 data-name="testling"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="testling">testling</a>
            </div> <!-- /.select-menu-item -->
        </div>

          <div class="select-menu-no-results">Nothing to show</div>
      </div> <!-- /.select-menu-list -->

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="tags">
        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/n1k0/backbone-events-standalone/tree/v0.2.2/README.md"
                 data-name="v0.2.2"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="v0.2.2">v0.2.2</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/n1k0/backbone-events-standalone/tree/0.2.1/README.md"
                 data-name="0.2.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="0.2.1">0.2.1</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/n1k0/backbone-events-standalone/tree/0.2.0/README.md"
                 data-name="0.2.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="0.2.0">0.2.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/n1k0/backbone-events-standalone/tree/0.1.5/README.md"
                 data-name="0.1.5"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="0.1.5">0.1.5</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/n1k0/backbone-events-standalone/tree/0.1.4/README.md"
                 data-name="0.1.4"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="0.1.4">0.1.4</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/n1k0/backbone-events-standalone/tree/0.1.3/README.md"
                 data-name="0.1.3"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="0.1.3">0.1.3</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/n1k0/backbone-events-standalone/tree/0.1.2/README.md"
                 data-name="0.1.2"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="0.1.2">0.1.2</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/n1k0/backbone-events-standalone/tree/0.1.1/README.md"
                 data-name="0.1.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="0.1.1">0.1.1</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/n1k0/backbone-events-standalone/tree/0.1.0/README.md"
                 data-name="0.1.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="0.1.0">0.1.0</a>
            </div> <!-- /.select-menu-item -->
        </div>

        <div class="select-menu-no-results">Nothing to show</div>
      </div> <!-- /.select-menu-list -->

    </div> <!-- /.select-menu-modal -->
  </div> <!-- /.select-menu-modal-holder -->
</div> <!-- /.select-menu -->

  <div class="button-group right">
    <a href="/n1k0/backbone-events-standalone/find/master"
          class="js-show-file-finder minibutton empty-icon tooltipped tooltipped-s"
          data-pjax
          data-hotkey="t"
          aria-label="Quickly jump between files">
      <span class="octicon octicon-list-unordered"></span>
    </a>
    <button class="js-zeroclipboard minibutton zeroclipboard-button"
          data-clipboard-text="README.md"
          aria-label="Copy to clipboard"
          data-copied-hint="Copied!">
      <span class="octicon octicon-clippy"></span>
    </button>
  </div>

  <div class="breadcrumb">
    <span class='repo-root js-repo-root'><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/n1k0/backbone-events-standalone" data-branch="master" data-direction="back" data-pjax="true" itemscope="url"><span itemprop="title">backbone-events-standalone</span></a></span></span><span class="separator"> / </span><strong class="final-path">README.md</strong>
  </div>
</div>


  <div class="commit file-history-tease">
      <img alt="Nicolas Perriault" class="main-avatar" data-user="41547" height="24" src="https://avatars0.githubusercontent.com/u/41547?v=2&amp;s=48" width="24" />
      <span class="author"><a href="/n1k0" rel="author">n1k0</a></span>
      <time datetime="2013-09-05T23:45:22+02:00" is="relative-time">September 05, 2013</time>
      <div class="commit-title">
          <a href="/n1k0/backbone-events-standalone/commit/6c16f58cac332bd7c37ddb795154b8868fe86bf6" class="message" data-pjax="true" title="added minified version">added minified version</a>
      </div>

    <div class="participation">
      <p class="quickstat"><a href="#blob_contributors_box" rel="facebox"><strong>1</strong>  contributor</a></p>
      
    </div>
    <div id="blob_contributors_box" style="display:none">
      <h2 class="facebox-header">Users who have contributed to this file</h2>
      <ul class="facebox-user-list">
          <li class="facebox-user-list-item">
            <img alt="Nicolas Perriault" data-user="41547" height="24" src="https://avatars0.githubusercontent.com/u/41547?v=2&amp;s=48" width="24" />
            <a href="/n1k0">n1k0</a>
          </li>
      </ul>
    </div>
  </div>

<div class="file-box">
  <div class="file">
    <div class="meta clearfix">
      <div class="info file-name">
          <span>103 lines (71 sloc)</span>
          <span class="meta-divider"></span>
        <span>2.559 kb</span>
      </div>
      <div class="actions">
        <div class="button-group">
          <a href="/n1k0/backbone-events-standalone/raw/master/README.md" class="minibutton " id="raw-url">Raw</a>
            <a href="/n1k0/backbone-events-standalone/blame/master/README.md" class="minibutton js-update-url-with-hash">Blame</a>
          <a href="/n1k0/backbone-events-standalone/commits/master/README.md" class="minibutton " rel="nofollow">History</a>
        </div><!-- /.button-group -->


            <a class="octicon-button disabled tooltipped tooltipped-w" href="#"
               aria-label="You must be signed in to make or propose changes"><span class="octicon octicon-pencil"></span></a>

          <a class="octicon-button danger disabled tooltipped tooltipped-w" href="#"
             aria-label="You must be signed in to make or propose changes">
          <span class="octicon octicon-trashcan"></span>
        </a>
      </div><!-- /.actions -->
    </div>
        <div id="readme" class="blob instapaper_body">
    <article class="markdown-body entry-content" itemprop="mainContentOfPage"><h1>
<a name="user-content-backbone-events-standalone" class="anchor" href="#backbone-events-standalone" aria-hidden="true"><span class="octicon octicon-link"></span></a>backbone-events-standalone</h1>

<p><a href="https://travis-ci.org/n1k0/backbone-events-standalone"><img src="https://camo.githubusercontent.com/c19dba6818af1435545220aca1777e4bad066da4/68747470733a2f2f7472617669732d63692e6f72672f6e316b302f6261636b626f6e652d6576656e74732d7374616e64616c6f6e652e706e67" alt="Build Status" data-canonical-src="https://travis-ci.org/n1k0/backbone-events-standalone.png" style="max-width:100%;"></a></p>

<p>This is an extraction of the <a href="http://backbonejs.org/#Events">Events</a> module of <a href="http://backbonejs.org/">Backbone</a> which can be used
standalone (no external dependency), in the browser or in a nodejs environment.</p>

<h2>
<a name="user-content-oh-dear-why-another-eventemitter" class="anchor" href="#oh-dear-why-another-eventemitter" aria-hidden="true"><span class="octicon octicon-link"></span></a>Oh dear. Why another EventEmitter?</h2>

<p>This project started because I appreciate the <code>Backbone.Events</code> interface &amp;
features while I wanted to keep using it within non-DOM environments (think a
<a href="https://developer.mozilla.org/en-US/docs/Social_API/Service_worker_API_reference">Social API Web Worker</a> for example).</p>

<p>I've ported the <a href="https://github.com/jashkenas/backbone/blob/699fe3271262043bb137bae97bd0003d6d193f27/test/events.js">original Backbone.Events tests</a> to mocha &amp; <a href="http://chaijs.com/">chai</a> so I can
run them within a <a href="/n1k0/backbone-events-standalone/blob/master/nodejs.org">nodejs</a> environment and ensure the extracted API actually
works as expected without the burden of setting up continuous integration of
browser tests.</p>

<h2>
<a name="user-content-installation" class="anchor" href="#installation" aria-hidden="true"><span class="octicon octicon-link"></span></a>Installation</h2>

<h3>
<a name="user-content-bower-for-browser-use" class="anchor" href="#bower-for-browser-use" aria-hidden="true"><span class="octicon octicon-link"></span></a>Bower (for browser use)</h3>

<pre><code>$ bower install backbone-events-standalone
</code></pre>

<h3>
<a name="user-content-npm-node" class="anchor" href="#npm-node" aria-hidden="true"><span class="octicon octicon-link"></span></a>NPM (node)</h3>

<pre><code>$ npm install backbone-events-standalone
</code></pre>

<h2>
<a name="user-content-usage" class="anchor" href="#usage" aria-hidden="true"><span class="octicon octicon-link"></span></a>Usage</h2>

<h3>
<a name="user-content-standard-browser-use" class="anchor" href="#standard-browser-use" aria-hidden="true"><span class="octicon octicon-link"></span></a>Standard browser use</h3>

<div class="highlight highlight-html"><pre><span class="nt">&lt;script </span><span class="na">src=</span><span class="s">"backbone-events-standalone.js"</span><span class="nt">&gt;&lt;/script&gt;</span>
<span class="nt">&lt;script&gt;</span>
  <span class="c1">// use BackboneEvents</span>
<span class="nt">&lt;/script&gt;</span>
</pre></div>

<p><strong>Notes:</strong></p>

<ul class="task-list">
<li>You may want to use the minified version stored in <code>backbone-events-standalone.min.js</code>.</li>
<li>Using Bower, files are usually available within <code>bower_components/backbone-events-standalone</code>
</li>
</ul><h3>
<a name="user-content-amd" class="anchor" href="#amd" aria-hidden="true"><span class="octicon octicon-link"></span></a>AMD</h3>

<div class="highlight highlight-js"><pre><span class="nx">require</span><span class="p">([</span><span class="s2">"backbone-events-standalone"</span><span class="p">],</span> <span class="kd">function</span><span class="p">(</span><span class="nx">BackboneEvents</span><span class="p">)</span> <span class="p">{</span>
  <span class="c1">// ...</span>
<span class="p">});</span>
</pre></div>

<h3>
<a name="user-content-in-nodejsbrowserify" class="anchor" href="#in-nodejsbrowserify" aria-hidden="true"><span class="octicon octicon-link"></span></a>In nodejs/browserify</h3>

<div class="highlight highlight-js"><pre><span class="kd">var</span> <span class="nx">BackboneEvents</span> <span class="o">=</span> <span class="nx">require</span><span class="p">(</span><span class="s2">"backbone-events-standalone"</span><span class="p">);</span>
</pre></div>

<h3>
<a name="user-content-api" class="anchor" href="#api" aria-hidden="true"><span class="octicon octicon-link"></span></a>API</h3>

<p>The <code>BackboneEvents#mixin</code> method helps extending any object or prototype to add eventing
support to it:</p>

<div class="highlight highlight-js"><pre><span class="kd">var</span> <span class="nx">myEventEmitter</span> <span class="o">=</span> <span class="nx">BackboneEvents</span><span class="p">.</span><span class="nx">mixin</span><span class="p">({});</span>
<span class="nx">myEventEmitter</span><span class="p">.</span><span class="nx">on</span><span class="p">(</span><span class="s2">"foo"</span><span class="p">,</span> <span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">).</span><span class="nx">trigger</span><span class="p">(</span><span class="s2">"foo"</span><span class="p">,</span> <span class="s2">"hello emitter"</span><span class="p">);</span>

<span class="c1">// alternatively</span>
<span class="kd">function</span> <span class="nx">Plop</span><span class="p">()</span> <span class="p">{}</span>
<span class="nx">BackboneEvents</span><span class="p">.</span><span class="nx">mixin</span><span class="p">(</span><span class="nx">Plop</span><span class="p">.</span><span class="nx">prototype</span><span class="p">);</span>
<span class="p">(</span><span class="k">new</span> <span class="nx">Plop</span><span class="p">()).</span><span class="nx">on</span><span class="p">(</span><span class="s2">"foo"</span><span class="p">,</span> <span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">).</span><span class="nx">trigger</span><span class="p">(</span><span class="s2">"foo"</span><span class="p">,</span> <span class="s2">"hello emitter"</span><span class="p">);</span>
</pre></div>

<p><code>BackboneEvents</code> API &amp; usage is the same as <a href="http://backbonejs.org/#Events">Backbone.Events</a>.</p>

<h2>
<a name="user-content-test" class="anchor" href="#test" aria-hidden="true"><span class="octicon octicon-link"></span></a>Test</h2>

<pre><code>$ npm test
</code></pre>

<h2>
<a name="user-content-license" class="anchor" href="#license" aria-hidden="true"><span class="octicon octicon-link"></span></a>License</h2>

<p>MIT</p>

<h2>
<a name="user-content-credits" class="anchor" href="#credits" aria-hidden="true"><span class="octicon octicon-link"></span></a>Credits</h2>

<p><a href="http://ashkenas.com/">Jeremy Ashkenas</a>, Backbone author</p></article>
  </div>

  </div>
</div>

<a href="#jump-to-line" rel="facebox[.linejump]" data-hotkey="l" style="display:none">Jump to Line</a>
<div id="jump-to-line" style="display:none">
  <form accept-charset="UTF-8" class="js-jump-to-line-form">
    <input class="linejump-input js-jump-to-line-field" type="text" placeholder="Jump to line&hellip;" autofocus>
    <button type="submit" class="button">Go</button>
  </form>
</div>

        </div>

      </div><!-- /.repo-container -->
      <div class="modal-backdrop"></div>
    </div><!-- /.container -->
  </div><!-- /.site -->


    </div><!-- /.wrapper -->

      <div class="container">
  <div class="site-footer">
    <ul class="site-footer-links right">
      <li><a href="https://status.github.com/">Status</a></li>
      <li><a href="http://developer.github.com">API</a></li>
      <li><a href="http://training.github.com">Training</a></li>
      <li><a href="http://shop.github.com">Shop</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/about">About</a></li>

    </ul>

    <a href="/" aria-label="Homepage">
      <span class="mega-octicon octicon-mark-github" title="GitHub"></span>
    </a>

    <ul class="site-footer-links">
      <li>&copy; 2014 <span title="0.02611s from github-fe134-cp1-prd.iad.github.net">GitHub</span>, Inc.</li>
        <li><a href="/site/terms">Terms</a></li>
        <li><a href="/site/privacy">Privacy</a></li>
        <li><a href="/security">Security</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
  </div><!-- /.site-footer -->
</div><!-- /.container -->


    <div class="fullscreen-overlay js-fullscreen-overlay" id="fullscreen_overlay">
  <div class="fullscreen-container js-suggester-container">
    <div class="textarea-wrap">
      <textarea name="fullscreen-contents" id="fullscreen-contents" class="fullscreen-contents js-fullscreen-contents js-suggester-field" placeholder=""></textarea>
    </div>
  </div>
  <div class="fullscreen-sidebar">
    <a href="#" class="exit-fullscreen js-exit-fullscreen tooltipped tooltipped-w" aria-label="Exit Zen Mode">
      <span class="mega-octicon octicon-screen-normal"></span>
    </a>
    <a href="#" class="theme-switcher js-theme-switcher tooltipped tooltipped-w"
      aria-label="Switch themes">
      <span class="octicon octicon-color-mode"></span>
    </a>
  </div>
</div>



    <div id="ajax-error-message" class="flash flash-error">
      <span class="octicon octicon-alert"></span>
      <a href="#" class="octicon octicon-x close js-ajax-error-dismiss" aria-label="Dismiss error"></a>
      Something went wrong with that request. Please try again.
    </div>


      <script crossorigin="anonymous" src="https://assets-cdn.github.com/assets/frameworks-12d5fda141e78e513749dddbc56445fe172cbd9a.js" type="text/javascript"></script>
      <script async="async" crossorigin="anonymous" src="https://assets-cdn.github.com/assets/github-91c8c29a09ed2b10dc0fe500f8ca17a791e374ae.js" type="text/javascript"></script>
      
      
        <script async src="https://www.google-analytics.com/analytics.js"></script>
  </body>
</html>

