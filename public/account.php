<!--
    Group:            4
-->

<!DOCTYPE html>
<html lang="en" content="text/html">
	<head>
		<meta charset="utf-8"/>
		<title>pix | test album</title>

		<link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon">

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
		<script
			  src="https://code.jquery.com/ui/1.12.0/jquery-ui.js"
			  integrity="sha256-0YPKAwZP7Mp3ALMRVB2i8GXeEndvCq3eSl/WsAl1Ryk="
			  crossorigin="anonymous"></script>

		<!-- Latest compiled and minified CSS -->
		<link rel="stylesheet"
					href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
					integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
					crossorigin="anonymous">
		<!-- Latest compiled and minified JavaScript -->
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
						integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
						crossorigin="anonymous"></script>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<link rel="stylesheet" href="css/stylesheet.css"/>

		<script src="/socket.io/socket.io.js"></script>
		<script src="js/client.js"></script>
		<script src="js/styling.js"></script>
	</head>

  <body>
	<nav class="navbar navbar-fixed-top" role="navigation">
		<div class="fluid-container">
	  <!-- Brand and toggle get grouped for better mobile display -->
	  <div class="navbar-header">
			<a id="logo" class="navbar-brand" href="account">
				<img src="images\logo-small.png" width="183" height="80" alt="pix logo">
			</a>
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav-content">
				<span class="glyphicon glyphicon-menu-hamburger"></span>
			</button>
	  </div>

	  <!-- Collect the nav links, forms, and other content for toggling -->
	  <div id="nav-content" class="nav-content collapse navbar-collapse vertical-align">
			<ul class="nav navbar-nav navbar-right">
	      <li class="logout-btn"><a href="/logout" ><img src="https://mail.google.com/mail/u/0/?logout&hl=en" style="display: none;"/><span class="glyphicon glyphicon-log-out"></span>
					<span class="hidden-sm hidden-md hidden-lg">Logout</span></a></li>
	    </ul>
			<form class="navbar-form navbar-right" role="search">
			<div class="search-bar input-group search-bar-closed">
					<input type="text" class="search-input search form-control" placeholder="Search" name="search">
					<div class="input-group-btn">
						<button class="search-btn btn btn-default" type="submit">
							<i class="glyphicon glyphicon-search"></i>
							<span class="hidden-sm hidden-md hidden-lg">Search</span></a></li>
						</button>
					</div>
				</div>
			</form>
	  </div><!-- /.navbar-collapse -->
	</div>
</nav>

<div class="row-offcanvas row-offcanvas-left">
  <div id="sidebar" class="sidebar-offcanvas">
		<div id="accordion" class="panel-group" role="tablist">
      <div id="album-list" class="panel panel-default">
      </div>
    </div>
  </div>
  <div id="main" class="album-content">
      <div class="col-md-12">
				<p class="visible-xs">
					<button type="button" class="show-menu btn btn-primary btn-xs" data-toggle="offcanvas"><i class="fa fa-chevron-right"></i></button>
				</p>
      <div class="row header">
        <span class="col-lg-3 col-md-3 col-sm-2 hidden-xs-down line"><hr></span>
        <span class="col-lg-6 col-md-6 col-sm-8 col-xs-12">
          <span class="user-icon fa-stack fa-lg">
            <span class="fa fa-circle fa-stack-2x"></span>
            <span class="album-header fa fa-user fa-stack-1x"></span>
          </span>
          <span id="album-owner" class="heading user-name"><!-- ALBUM OWNER GOES HERE --></span>
          <div id="album-name" class="subheading album-name"><!-- ALBUM NAME GOES HERE --></div>
        </span>
        <span class="col-lg-3 col-md-3 col-sm-2 hidden-xs-down line"><hr></span>
      </div>
      <div id="album-images" class="row gallery">
				<!-- IMAGES GO HERE -->
      </div>
    </div>
  </div>
</div><!--/row-offcanvas -->

	<div id="lightbox" class="modal fade" tabindex="-1" role="dialog">
	  <div class="modal-dialog">
	    <button type="button" id='img_cancel1' class="close hidden" data-dismiss="modal" aria-hidden="true">×</button>
	    <div class="modal-content">
				<div class="modal-header">
					<h4 id="modal-img-title" class="modal-title">I'm an Image Title</h4>
					<div id="del_img_msg"></div>
				</div>

	      <div class="modal-body">
	          <img src="" alt="" />
	      </div>
	    </div>
	  </div>
	</div>

	<!-- Album Form -->
	<div id="albumformbox" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<button type="button" id="alb_cancel1" class="close" data-dismiss="modal">×</button>
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">Create New Album</h4>
				</div>
				<div class="modal-body">
					<p id="error_text"></p>
					<form id='album_form' action="">
						<input type="text" class="album-name-box" id="alb_name" placeholder="Album name" autocomplete="off">
						<br>
						<button class="new-album-btn btn">Create</button>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" id="alb_cancel2" class="btn btn-default" data-dismiss="modal">Cancel</button>
				</div>
			</div>
		</div>
	</div>

	<!-- The Editor -->
	<div id="editorbox" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-lg">
			<button type="button" class="close" data-dismiss="modal">×</button>
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">Create New Image</h4>
					<p id="error_text_img"></p>
				</div>
				<div class="modal-body">
					<!--EDITOR TO GOES HERE-->
					<p>Editor goes here</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
				</div>
			</div>
		</div>
	</div>

	<!-- The Delete Dialog box-->
	<div id="deletebox" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">×</button>
					<h4 class="modal-title" id="del_this_title"></h4>
				</div>
				<div class="modal-body">
					<div id="del_msg"></div>
				</div>
			</div>
		</div>
	</div>

	<div id="error-msg-box" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">×</button>
					<h4 class="modal-title">Error</h4>
				</div>
				<div class="modal-body">
					<div id="error-msg-modal"></div>
				</div>
			</div>
		</div>
	</div>

</body>
</html>
