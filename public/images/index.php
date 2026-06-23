<?php 
   $page_title = "DR. BHAU DAJI LAD MUMBAI CITY MUSEUM - Home";  
   $year = date('Y'); 
   $month = date('m'); 
?>
<!--Header File-->
<?php include "includes/header.php"; ?>
<style type="text/css">
   .carousel-design .item.bdlimage:before {
   background-color:transparent;
   }
  .objectfitratio{
      object-fit: cover;
  }
  .instagram-feed .eapps-instagram-feed-posts-item-image{
   object-fit: contain;
  }  
  .banner2{
      background-image:url('../assets/bdlimages/menu-banner/onehundredthousandsuns.jpg');
   }
  .historyplaza{
      background-image:url('../assets/bdlimages/menu-banner/cartographies-banner-image.jpg');
   }
</style>
<div class="mother">
   <div id="carousel-example-generic" class="carousel
      slide carousel-design" data-ride="carousel">
      <ol class="carousel-indicators hidden-xs">
        <!-- <li data-target="#carousel-example-generic" data-slide-to="0"
            class="active"></li>-->
         <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
         <li data-target="#carousel-example-generic" data-slide-to="1"></li>
         <li data-target="#carousel-example-generic" data-slide-to="2"></li>
         <li data-target="#carousel-example-generic" data-slide-to="3"></li>
         <li data-target="#carousel-example-generic" data-slide-to="4"></li>
         <li data-target="#carousel-example-generic" data-slide-to="5"></li>
         <li data-target="#carousel-example-generic" data-slide-to="6"></li>
         <li data-target="#carousel-example-generic" data-slide-to="7"></li>
         <li data-target="#carousel-example-generic" data-slide-to="8"></li>
         <li data-target="#carousel-example-generic" data-slide-to="9"></li>
         <!-- <li data-target="#carousel-example-generic" data-slide-to="10"></li> -->
         <!-- <li data-target="#carousel-example-generic" data-slide-to="11"></li> -->
      </ol>
      <!-- Wrapper for slides -->
      <div class="carousel-inner">
         
         <div class="item historyplaza active">
            <!-- <img src="<?php //echo BASE_URL; ?>assets/bdlimages/menu-banner/cartographies-banner-image.jpg" alt="" class="img-responsive" /> -->
            <div class="carousel-caption">
               <a href="<?php echo BASE_URL?>exhibitions/2024/Cartographies-of-the-Unseen.php" class="flex-caption" style="display: block; width:100%; height:100%;">
                  <h2>&nbsp;</h2>
                  <h1>Cartographies of the Unseen</h1>
                  <h3>Reena Saini Kallat</h3>
                  <h3>Curated by Tasneem Zakaria Mehta</h3>
                  <h2>Jan 31 - Apr 06, 2025</h2>
               </a>
                 
            </div>
         </div>
         <!-- <div class="item museumplaza ">
            <div class="carousel-caption">
               <a href="<?php echo BASE_URL; ?>explore/museum-plaza-and-garden.php" class="flex-caption">
                  <h1>Museum Plaza</h1>
                  <h2>Open to all<Br>
                  </h2>
                  <h3>Special Projects Space, Education Centre, Museum Shop & Cafe </h3>
               </a>
                 
            </div>
         </div> -->
        
         <div class="item b1 ">
            <!-- <img src="<?php echo BASE_URL; ?>assets/bdlimages/home-banner-01-2018.jpg" alt=""
               class="img-responsive" /> -->
            <div class="carousel-caption">
               <a href="<?php echo BASE_URL; ?>visit/index.php" class="flex-caption">
                  <h1>Mumbai's First Museum</h1>
                  <h2>Formerly the Victoria and Albert Museum
                  </h2>
               </a>
            </div>
         </div>
         <div class="item b2">
            <!-- <img src="<?php echo BASE_URL; ?>assets/bdlimages/about-landing-banner.jpg" alt=""
               class="img-responsive" /> -->
            <div class="carousel-caption">
               <a href="<?php echo BASE_URL; ?>collections/galleries.php" class="flex-caption">
                  <h1>Mumbai's First Museum</h1>
                  <h2>Formerly the Victoria and Albert Museum
                  </h2>
               </a>
            </div>
         </div>
         <!-- <div class="item b4 bdlimage">
            <div class="carousel-caption bookcaption bdldesktopitem">
               <h1>New Publication</h1>
               <h2>Available Online for Purchase</h2>
               <a href="https://imojo.in/12WYI8Y" target="_blank" style="display:block;height:100%;" class="flex-caption">
               Click here to order!
               </a>
            </div>
            <a href="https://imojo.in/12WYI8Y" target="_blank" style="display:block;height:100%;" class="bdlmobileitem  flex-caption">
            </a>
         </div> -->
         <div class="item museumexhibition" style="width: 100%;top: 0; left: 0;height: 100%;">
            <!-- <img src="<?php echo BASE_URL; ?>assets/bdlimages/home-banner-09-2016.jpg" alt=""
               class="img-responsive" /> -->
            <div class="carousel-caption">
               <a href="https://bdlmuseum.myinstamojo.com/product/3516874/mumbai-a-city-through-objects101-stories-fro-06c10/" target="_blank" class="flex-caption" style="width: 100%; height: 100%;display: block;">
               <h1>Museum Publication</h1>
                  <h2>Available Online</h2>
               </a>
            </div>
         </div>
         <div class="item b3">
            <!-- <img src="<?php echo BASE_URL; ?>assets/bdlimages/banner2.jpg" alt="" class="img-responsive" /> -->
            <div class="carousel-caption">
               <a href="<?php echo BASE_URL; ?>collections/index.php" class="flex-caption">
                  <h1>The Museum Collection </h1>
                  <h2>Permanent Exhibit </h2>
               </a>
            </div>
         </div>
        
         <!-- <div class="item b5">
            <div class="carousel-caption">
               <a href="<?php echo BASE_URL; ?>exhibitions/index.php#current" class="flex-caption">
                  <h1>Birds of India</h1>
                  <h2>Company Paintings, c.1800 to 1835</h2>
                  <h3>Nov 27, 2021 - Apr 19, 2022
                  </h3>
                  <h4>In collaboration with DAG
                  </h4>
               </a>
            </div>
            </div> -->
         <!-- <div class="item">
            <img src="<?php echo BASE_URL; ?>assets/bdlimages/vaica-banner.webp" alt=""
               class="img-responsive" />
            <div class="carousel-caption">
               <a href="<?php echo BASE_URL; ?>explore/film-programmes.php#section2" class="flex-caption">
                  <h1>VAICA 2</h1>
                  <h2>Video art by Indian contemporary artists.
                  </h2>
               </a>
            </div>
            </div> -->
           
         <div class="item b6">
            <!-- <img src="<?php echo BASE_URL; ?>assets/bdlimages/home-banner-09-2016.jpg" alt=""
               class="img-responsive" /> -->
            <div class="carousel-caption">
               <a href="<?php echo BASE_URL; ?>learn/families.php" class="flex-caption">
                  <h1>Family Programmes </h1>
                  <h2> Guided Tours, Workshops, Free Activity Days </h2>
               </a>
            </div>
         </div>
        
         <div class="item b7">
            <!-- <img src="<?php echo BASE_URL; ?>assets/bdlimages/home-banner-06-2016.jpg" alt=""
               class="img-responsive" /> -->
            <div class="carousel-caption">
               <a href="<?php echo BASE_URL; ?>visit/index.php" target="_blank" class="flex-caption">
                  <h1>Take a tour </h1>
                  <h2>Free Guided Tour every Saturday </h2>
                  <h3>English: 11:30 am </h3>
                  <h3>Marathi/Hindi: 12:30 pm</h3>
                  <h3>Tours for schools and colleges available</h3>
                  <h3>contact: education@bdlmuseum.org</h3>
               </a>
            </div>
         </div>
       
         <div class="item vrexhibition">
            <!-- <img src="<?php echo BASE_URL; ?>assets/bdlimages/home-banner-06-2016.jpg" alt=""
               class="img-responsive" /> -->
            <div class="carousel-caption">
               <a href="https://bdlmuseum.myinstamojo.com/product/3516874/mumbai-a-city-through-objects101-stories-fro-06c10/" target="_blank" class="flex-caption">
                  <h1>Virtual Exhibitions</h1>
                  <h2>In collaboration with Google Arts & Culture</h2>
               </a>
            </div>
         </div>
         <!-- <div class="item  bdlexhi">
            <div class="carousel-caption bookcaption bdldesktopitem">
               <h2>Digital Exhibition</h2>
               <h2>A Hall of Wonder</h2>
               <h2>The exhibition celebrates 150 years of<Br> Dr. Bhau Daji Lad Museum, the first<Br> Museum in Mumbai, India</h2>
               <a href="https://artsandculture.google.com/u/0/pocketgallery/-AXxYWLmkfJIHA" target="_blank" style="display:block;height:auto;margin-bottom:25px;"
                class="">
               Click here to Visit!
               </a>
               <h2>In partnership with Google Arts & Culture
                   <img src="<?php echo BASE_URL; ?>assets/bdlimages/partnership.jpg" style="width:30px;display: inline-block;
    margin-left: 15px" alt=""
               class="img-responsive" /> </h2>
            </div>
           <a href="https://artsandculture.google.com/u/0/pocketgallery/-AXxYWLmkfJIHA" 
           style="display: block;position: relative;width: 100%;height: 100%;" class="bdlmobileitem  flex-caption" target="_blank">
            
           </a>
         </div> -->
         <!-- <div class="item b8">
           
            <div class="carousel-caption">
               <a href="https://artsandculture.google.com/exhibit/textiles-and-attires-19th-early-20th-century-bombay-presidency/EAKy8kNCYEA_JQ" target="_blank" class="flex-caption">
                  <h1>We Wear Culture</h1>
                  <h2>Virtual Exhibition</h2>
                  <h4>In collaboration with Google Arts & Culture
                  </h4>
               </a>
            </div>
         </div> -->
        
         <div class="item b10">
            <!-- <img src="<?php echo BASE_URL; ?>assets/bdlimages/live-music-banner.jpg" alt="" class="img-responsive" /> -->
            <div class="carousel-caption">
               <a target="_blank" href="https://open.spotify.com/user/n2r2bp6sdym4juo4zls6j4lt4?si=ZQAsSg3vQkGTnmIv8gEVFg&nd=1" class="flex-caption">
                  <h1>Museum on Spotify!
                     <br>
                  </h1>
                  <h2>Explore our collection-inspired playlists </h2>
               </a>
            </div>
         </div>
         <div class="item b9">
            <!-- <img src="<?php echo BASE_URL; ?>assets/bdlimages/banner_image_30_dec_2019.jpg" alt=""
               class="img-responsive" /> -->
            <div class="carousel-caption">
               <a href="<?php echo BASE_URL; ?>explore/museum-plaza-and-garden.php#section4"
                  class="flex-caption">
                  <h1>Museum Shop</h1>
               </a>
            </div>
         </div>
      </div>
      <a class="left carousel-control" href="#carousel-example-generic"
         role="button" data-slide="prev" style="background-image: none;">
         <!-- <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>-->
         <!-- <i class="fa fa-chevron-left"></i> -->
         <span class="sr-only">Previous</span>
      </a>
      <a class="right carousel-control" href="#carousel-example-generic"
         role="button" data-slide="next" style="background-image: none;">
         <!-- <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>-->
         <!-- <i class="fa fa-chevron-right"></i> -->
         <span class="sr-only">Next</span>
      </a>
   </div>
   <div class="home-box container_own">
      <div class="exhibition-home">
      <div class="row margin-auto">
         <div class="col-sm-12 col-md-8 col-lg-8 padding-0">
				<a href="https://www.bdlmuseum.org/collections/index.php" aria-label="upcomming">
               <div id="carousel-example-generic2" class="carousel
                  slide carousel-design2" data-ride="carousel">
                  <div class="carousel-design">
                     <!-- <ol class="carousel-indicators hidden-xs">
                        <li data-target="#carousel-example-generic2" data-slide-to="0" class="active"></li>
                        <li data-target="#carousel-example-generic2" data-slide-to="1" class=""></li>
                        <li data-target="#carousel-example-generic2" data-slide-to="2" class=""></li>
                     </ol> -->
                  </div>
                  <div class="carousel-inner">
                     <div class="item active">
                        <img src="<?php echo BASE_URL; ?>assets/bdlimages/upcomming/upcoming01.jpg" alt="" class="img-responsive w-100" /> 
                        <div class="carousel-design">
                           <!-- <div class="carousel-caption">
                              <h1>Mumbai - A City Through Objects</h1>
                              <a href="https://bdlmuseum.myinstamojo.com/product/3516874/mumbai-a-city-through-objects-101-stories-fr-e012d/" class="flex-caption">
                                 <h2>Click here to buy and support the Museum!</h2>
                              </a>
                           </div> -->
                        </div>
                     </div>
					 
                     <!-- <div class="item">
                        <img src="<?php echo BASE_URL; ?>assets/bdlimages/exhibition-slider/02.jpg" alt="" class="img-responsive w-100" /> 
                        <div class="carousel-design">
                          
                        </div>
                     </div>
                     <div class="item">
                        <img src="<?php echo BASE_URL; ?>assets/bdlimages/exhibition-slider/03.jpg" alt="" class="img-responsive w-100" /> 
                        <div class="carousel-design">
                          
                        </div>
                     </div> -->
                  </div>
               </div>
			   </a>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4 padding-0">
               <div class="content-box-common">
                  <!-- <h1>EXHIBITION</h1> -->
                  <h1>Now available online!</h1>
                  <h2>'Mumbai - A City Through Objects, <br>
                  101 Stories from the Dr Bhau Daji Lad Museum'</h2>
                  <div class="subtitle">Edited by Tasneem Zakaria Mehta <br> Co-published with HarperCollins' new imprint, HarperDesign </div>
                  <h4><a href="https://bdlmuseum.myinstamojo.com/product/3516874/mumbai-a-city-through-objects101-stories-fro-06c10/" target="_blank" class="arrow-none" style="display:inline-block;">Click here</a> to buy your copy and support the Museum!  
                  </h4> 
                  <p class="visible-xs visible-sm hidden-md hidden-lg">
                  </p>
               </div>
            </div>
         </div>
      </div>
      <div class="exhibition-home" style="display:none;">
         <div class="row margin-auto">
            <div class="col-sm-12 col-md-8 col-lg-8 padding-0">
               <a href="<?php echo BASE_URL; ?>exhibitions/index.php#current">
                  <img src="<?php echo BASE_URL; ?>assets/bdlimages/exhbition-home-new.jpg" alt=""   class="img-responsive w-100" />
                   <div class="overlay">
                     <div class="overlay-content">
                        <!-- <h1>A Hall of Wonder </h1>
                        <h2>May 15, 2022 onwards</h2> -->
                        <p>The exhibition ‘A Hall of Wonder’ addresses the sense of wonderment that museums evoke while asking visitors to consider the many possible future museums as we celebrate 150 years of the Dr. Bhau Daji Lad Museum.
</p>
                     </div>
                  </div> 
               </a>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4 padding-0">
               <div class="content-box-common">
                  <h1>EXHIBITION</h1>
                  <h2>A Hall of Wonder</h2>
                  <!-- <h3>Curated by Tasneem Zakaria Mehta</h3> -->
                  <h4>May 19, 2022 onwards</h4>
                  <!-- <h4>In collaboration with DAG</h4> -->
                  <h6>Curatorial Director: Tasneem Zakaria Mehta</h6>
                  <p class="visible-xs visible-sm hidden-md hidden-lg">The exhibition ‘A Hall of Wonder’ addresses the sense of wonderment that museums evoke
while asking visitors to consider the many possible future museums as we celebrate 150
years of the Dr. Bhau Daji Lad Museum.</p>
               </div>
            </div>
         </div>
      </div>
      <div class="">
         <div class="row margin-auto">
            <div class="upcomming-home col-sm-12 col-md-4 col-lg-4 padding-0 equal-height left-height">
               <div class="content-box-common content-off" style=" paddign-bottom:20px; padding-top:20px;">
                    <h1>UPCOMING EVENTS</h1>
                    <h2>Film Screening | Amrita Sher-Gil: une rhapsodie indienne</h2>
				        <div class="subtitle">In collaboration with Alliance Française Bombay and The French Institute in India.</div>
                    <div class="subtitle">The screening will be followed by an online Q&A session with director Patrick Cazals, moderated by the Museum’s Director Tasneem Zakaria Mehta.</div>
                    <div class="subtitle">Sat, 22 Feb 2025 | 5:30–7:00 pm <br> Museum entry charges applicable</div>
                    <!-- <a href="https://forms.gle/VSFCvKaH6enCP7Ay9" class="arrow-none">Register Here</a>    -->
               </div>
               <a href="<?php echo BASE_URL;?>explore/film-programmes.php" aria-label="craftsmela" target="_blank">
                  <img src="<?php echo BASE_URL; ?>assets/bdlimages/upcomming/upcoming-film-screening.jpg" alt=""   class="img-responsive w-100" style=""/>
                  <div class="overlay">
                     <div class="overlay-content">
                        <!-- <h1>Online Workshop | Free Landscapes</h1> -->
                        <!-- <h2>(online session)</h2> -->
                        <p></p>
                     </div>
                  </div>
               </a>
            </div>
            <div class="object-month col-sm-12 col-md-8 col-lg-8 padding-0">
               <div class="row margin-auto">
                  <div class="col-sm-12 col-md-8 col-lg-7 padding-0">
                     <a href="<?php echo BASE_URL; ?>collections/index.php" aria-label="collections">
                        <img src="<?php echo BASE_URL; ?>assets/bdlimages/object-of-month-jan-2024.jpg" alt=""  class="objectfitratio equal-height img-responsive w-100" />
                        <div class="overlay">
                           <div class="overlay-content">
                              <!-- <h1>Object of the Month</h1> -->
                              <!-- <p>An animated scene of a royal hunt or shikar, executed in minute details on gold tracery, is depicted on the lid of this box from Nathdwara in Rajasthan. It is a fine example of the Rajasthani thewa work that originated in Pratapgarh. Thewa work involved fusing glass and an overlaid tracing on gold foil at high temperatures on metal or silver parcel-gilt. Snuff boxes, jewellery, brooches, and salvers executed in the thewa style were very popular in the Western market in the 19th - early 20th century.</p> -->
                           </div>
                        </div>
                     </a>
                  </div>
                  <div class="col-sm-12 col-md-4 col-lg-5 padding-0">
                     <div class="content-box-common">
                        <h1>COLLECTION</h1>
                        <h2>Object of the Month</h2>
                        <div class="subtitle">Round lamp in Persian design, brass, late 19th to early 20th century, Punjab.</div>
                        <!-- <br>Acquired by the Museum in 1925. -->
                        <div class="subtitle">This spherical lamp conceals a remarkable combination of traditional craft practice and innovation. Inside the lamp are three mechanical rings, known as gimbals, which hold the source of light, such as a candle upright even if the sphere is upturned or rolled. When hung from the ceiling, perforated lamps cast mesmerising shadows. </div>
                        <!-- <h4>Click <a href="<?php echo BASE_URL; ?>learn/families.php#color" style="display: inline-block;">here</a> to download & colour our Minton Tiles Worksheet!</h4> -->
                        <!-- <p class="visible-xs visible-sm hidden-md hidden-lg">An animated scene of a royal hunt or shikar, executed in minute details on gold tracery, is depicted on the lid of this box from Nathdwara in Rajasthan. It is a fine example of the Rajasthani thewa work that originated in Pratapgarh. Thewa work involved fusing glass and an overlaid tracing on gold foil at high temperatures on metal or silver parcel-gilt. Snuff boxes, jewellery, brooches, and salvers executed in the thewa style were very popular in the Western market in the 19th - early 20th century. </p> -->
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div class="">
         <div class="row margin-auto">
            <div class="col-sm-12 col-md-6 col-lg-6">
               <div class="learn-home row">
                  <div class="col-sm-12 col-md-7 col-lg-7 padding-0">
                     <a href="<?php echo BASE_URL; ?>learn/index.php">
                        <img src="<?php echo BASE_URL; ?>assets/bdlimages/learn.jpg" alt=""   class="objectfitratio img-responsive w-100 equal-height2" />
                        <div class="overlay">
                           <div class="overlay-content">
                              <h1>Workshops For Schools</h1>
                              <p>Engage with the museum collection<br> and contemporary exhibitions critically<br> and creatively through interpretative<br> gallery visits and workshops!</p>
                              <p class="last">For all age groups.</p>
                           </div>
                        </div>
                     </a>
                  </div>
                  <div class="col-sm-12 col-md-5 col-lg-5 padding-0">
                     <div class="content-box-common">
                        <h1>LEARN</h1>
                        <h2>Workshops for schools</h2>
                        <div class="subtitle">Available on request</div>
                        <a href="<?php echo BASE_URL; ?>learn/index.php" class="arrow-none">Book Now</a>
                     </div>
                  </div>
               </div>
            </div>
            <div class="col-sm-12 col-md-6 col-lg-6">
               <div class="calendar-home row">
                  <div class="col-sm-12 col-md-4 col-lg-4 padding-0">
                     <a href="<?php echo BASE_URL; ?>calendar/index.php">
                        <img src="<?php echo BASE_URL; ?>assets/bdlimages/calendar.jpg" alt=""   class="objectfitratio img-responsive w-100 equal-height2" />
                        <div class="overlay">
                           <div class="overlay-content pr-0">
                              <h1>Book Now</h1>
                           </div>
                        </div>
                     </a>
                  </div>
                  <div class="col-sm-12 col-md-8 col-lg-8 padding-0">
                     <div class="content-box-common">
                        <h1>CALENDAR</h1>
                        <h2>Events, exhibits, workshops,<br>
                           talks at the museum
                        </h2>
                        <div class="subtitle"><?php echo $month.'/'.$year; ?></div>
                        <!-- <a href="<?php echo BASE_URL; ?>calendar/index.php" class="arrow-none">Book Now</a> -->
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div class="video-home">
         <div class="row margin-auto">
            <div class="col-sm-12 order-mobile-2 col-md-3 col-lg-3 padding-0">
               <div class="content-box-common">
                  <h1>VIRTUAL TOUR</h1>
                  <h2>Take a Virtual Tour</h2>
               </div>
            </div>
            <div class="col-sm-12 col-md-9 col-lg-9 padding-0">
               <a href="<?php echo BASE_URL; ?>explore/google-arts-project.php" aria-label="google">
                  <img src="<?php echo BASE_URL; ?>assets/bdlimages/video.jpg" alt=""   class="img-responsive w-100" />
                  <div class="overlay">
                     <div class="overlay-content">
                        <img src="<?php echo BASE_URL; ?>assets/bdlimages/play.png" alt=""   class="img-responsive w-100" />
                     </div>
                  </div>
               </a>
            </div>
         </div>
      </div>
      <div class="">
         <div class="row margin-auto">
            <div class="museum-home col-sm-12 col-md-8 col-lg-8 padding-0 right-height">
               <div class="row margin-auto">
                  <div class="col-sm-12 col-md-7 col-lg-7 padding-0">
                     <a href="<?php echo BASE_URL; ?>about/museum-expansion.php" class="">
                        <img src="<?php echo BASE_URL; ?>assets/bdlimages/museum-expansion.jpg" alt=""  width="" height="" class="img-responsive w-100 equal-height3 objectfitratio"/>
                        <div class="overlay">
                           <div class="overlay-content">
                              <h1>Museum Expansion</h1>
                              <p> The Museum is in the process of creating a dynamic new identity<br>
                                 for itself as a cultural hub in Mumbai. We are excited to<br>
                                 welcome a new building, which will be an iconic addition to the<br>
                                 architectural and cultural heritage of the city. 
                              </p>
                           </div>
                        </div>
                     </a>
                  </div>
                  <div class="col-sm-12 col-md-5 col-lg-5 padding-0">
                     <div class="content-box-common">
                        <h1>MUSEUM OF THE FUTURE</h1>
                        <h2>Museum <Br>Expansion</h2>
                     </div>
                  </div>
               </div>
            </div>
            <div class="video-restore col-sm-12 col-md-4 col-lg-4 padding-0 equal-height3">
               <div class="content-box-common content-off">
                  <h1>VIDEO</h1>
                  <h2>Restoration & Revitalisation</h2>
               </div>
               <a href="https://www.youtube.com/watch?v=bCtGYBxiknw" target="_blank" aria-label="video">
                  <img src="<?php echo BASE_URL; ?>assets/bdlimages/video-restore.jpg" alt=""   class="img-responsive w-100" />
                  <div class="overlay">
                     <div class="overlay-content">
                        <img src="<?php echo BASE_URL; ?>assets/bdlimages/play.png" alt=""   class="img-responsive w-100" />
                     </div>
                  </div>
               </a>
            </div>
         </div>
      </div>
   </div>
</div>
<div id="myModal" class="modal fade index_popup">
   <div class="modal-dialog">
      <div class="modal-content">
         <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
         </div>
         <div class="modal-body">
            <p>Kindly note that the Museum will stay open on the following Wednesdays: Feb 19 (Chhatrapati Shivaji Maharaj Jayanti) and Feb 26 (Maha Shivratri). The Museum will be shut to the public on Thursdays, 20th and 27th February 2025.</p>
            <!-- <p><b>Closed on all Wednesdays.</b></p> -->
            <button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>
         </div>
      </div>
   </div>
</div>
<!--Footer File-->
<?php include ('includes/footer.php'); ?>
<script src="<?php echo BASE_URL; ?>assets/js/matchheightscript.js"></script>