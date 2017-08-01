function getValue(){

   var value= $.ajax({
      url: 'resources/data.json',
      async: false
   }).responseText;
  var data = JSON.parse(value);
   return data;
}

var data = getValue();

console.log(data);

$('document').ready(function() {

  var main = function () {
    $('.back-icon').hide();
    $('.search-icon').hide();
    $('.refresh-icon').hide();
    $('.overlay').delay(500).fadeOut('slow', function() {
    });

   };
  var all = function () {

    $('.back-icon').show();
    $('.search-icon').show();
    $('.refresh-icon').show();

    function getValue(){

       var value= $.ajax({
          url: 'resources/data.json',
          async: false
       }).responseText;
      var data = JSON.parse(value);
       return data;
    }

    var data = getValue();

    for (i=0;i<data.categories.length;i++){

      var size = 0;

      for (j=0;j<data.pdf.length;j++){
        if (data.pdf[j].cat == data.categories[i].title){
          size++
        }
      }
if (data.categories[i].assigned == 'true'){
    $('.content').append('<div class="dragit col-xs-12"><div class="col-xs-6 no-pad" onclick="subnav(this)"><img class="folder-icon" src="images/folder.png">'+data.categories[i].title+'</div><div class="col-xs-4">'+data.categories[i].date+'</div><div class="col-xs-2">'+size+' Files</div><img class=" edit-icon" src="images/edit.png"></div>');
  }
  else if (data.categories[i].assigned == 'false'){
    $('.uncontent').append('<div class="dragit col-xs-12"><div class="col-xs-6 no-pad" onclick="subnav(this)"><img class="folder-icon" src="images/folder.png">'+data.categories[i].title+'</div><div class="col-xs-4">'+data.categories[i].date+'</div><div class="col-xs-2">'+size+' Files</div><img class=" edit-icon" src="images/edit.png"></div>');
  }

}

$('.edit-icon').click(function(){
    $('#editcat').dialog();
});

  };

  var sub = function () {

    function getValue(){

       var value= $.ajax({
          url: 'resources/data.json',
          async: false
       }).responseText;
      var data = JSON.parse(value);
       return data;
    }

    var data = getValue();

    pdflist = [];

    var getcat = $( 'body' ).data();

    intosub = getcat.cat;

    catname = intosub.innerText;

    $('.subhead').append(catname);

    for (i=0;i<data.categories.length;i++){

  if (catname == data.categories[i].title){

  for (k=0; k<data.categories[i].subcats.length;k++){

    var size = 0;

    for (j=0;j<data.pdf.length;j++){
      if (data.pdf[j].cat == data.categories[i].title){
        if (data.pdf[j].subcat == data.categories[i].subcats[k].title){
          size++;

      }
      }
      if (data.pdf[j].subcat == 'none'){
        console.log(j);
        console.log(data.pdf[j]);
        pdflist.push(data.pdf[j]);
      }
    }
    console.log(pdflist);

    $('.subcontent').append('<div class="dragit col-xs-12"><div class="col-xs-6 no-pad" onclick="datanav(this)"><img class="folder-icon" src="images/folder.png">'+data.categories[i].subcats[k].title+'</div><div class="col-xs-4">'+data.categories[i].subcats[k].date+'</div><div class="col-xs-2">'+size+' Files</div><img class=" edit-icon" src="images/edit.png"></div>');

  }
  }
  }


    $('.edit-icon').click(function(){
        $('#editsubcat').dialog();
    });

  };

  var data = function () {

    function getValue(){

       var value= $.ajax({
          url: 'resources/data.json',
          async: false
       }).responseText;
      var data = JSON.parse(value);
       return data;
    }

    var data = getValue();

    var getdata = $( 'body' ).data();

    intodata = getdata.data;

    subcatname = intodata.innerText;

    $('.datahead').append(catname+' > '+subcatname);

    console.log(pdflist);

    for (j=0;j<pdflist.length;j++){

          console.log(data.pdf[j]);

            $('.datacontent').append('<div class="dragit col-xs-12"><a href="pdfurl"><div class="col-xs-6 no-pad"><img class="folder-icon" src="images/pdficon.png">'+pdflist[j].name+'</div></a><div class="col-xs-4">'+pdflist[j].date+'</div><div class="col-xs-2">'+pdflist[j].size+'</div><img class=" edit-icon" src="images/edit.png"></div>');

      }

    $('.edit-icon').click(function(){
        $('#editfile').dialog();
    });

   };

  var allroutes = function() {
    var route = window.location.hash.slice(2);
    var sections = $('section');
    var section;

    section = sections.filter('[data-route=' + route + ']');

    if (section.length) {
      sections.hide(250);
      section.show(250);
    }
  };

  var routes = {
    '/main': main,
    '/all': all,
    '/sub': sub,
    '/data': data
  };

  var router = Router(routes);

  router.configure({
    on: allroutes
  });

  router.init();
});

window.location = '#/main';

$('.search-icon').click(function(){
  $('.searchbox').slideToggle();
});

$('.newcat-icon').click(function(){
    $('#addcat').dialog();
});

$('.newfile-icon').click(function(){
    $('#addfile').dialog();
});

$('.newsub-icon').click(function(){
    $('#addsub').dialog();
});

function subnav(intosub){

  intosub = intosub;

  $('body' ).data('cat', intosub);

  window.location = '#/sub';

}

function datanav(intodata){

  $('body' ).data('data', intodata);

  window.location = '#/data';

}

function back(){
  $('.content').empty();
  $('.uncontent').empty();
  $('.subhead').empty();
  $('.subcontent').empty();
  $('.datacontent').empty();
  $('.datahead').empty();

     var newloc = window.location.hash;

       if (newloc == '#/sub'){
         window.location = '#/all';
       }

       if (newloc == '#/all'){
         window.location = '#/main';
       }

       if (newloc == '#/data'){
         window.location = '#/sub';
       }

}

$(window).on('hashchange', function() {

  var newloc = window.location.hash;

  if (newloc == '#/main'){
  $('.content').empty();
  $('.uncontent').empty();
  $('.subhead').empty();
  $('.subcontent').empty();
  $('.datahead').empty();

}

  if (newloc == '#/all'){
    $('.subhead').empty();
    $('.subcontent').empty();
    $('.datacontent').empty();
    $('.datahead').empty();

  }

  if (newloc == '#/sub'){
    $('.content').empty();
    $('.uncontent').empty();
    $('.datacontent').empty();
    $('.datahead').empty();

  }

  if (newloc == '#/data'){
    $('.content').empty();
    $('.uncontent').empty();
    $('.subhead').empty();
    $('.subcontent').empty();
  }

});
