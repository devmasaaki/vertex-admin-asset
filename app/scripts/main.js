var API_HOST = 'https://test-vertexpolicytoolkit.interact.technology';
window.asset_id = 1;
var categories = [];
var unassigned_subcategories = [];
var unassigned_items = [];
var yao = new Yao.YaoApi();
var step = 0;
var drag = false;
var dialog_effect = { modal: true, show: {effect: 'scale', duration: 0}, hide:{effect: 'scale', duration: 0}};
console.log(window.asset_id);

$('body' ).data('asset_id', 1);


$('document').ready(function() {
  function main() {
    $('.back-icon').hide();
    $('.search-icon').hide();
    $('.refresh-icon').hide();
    $('.overlay').delay(500).fadeOut('slow', function() {});
  };
  

  function all() {
    // $('.head1').empty();
    // $('.head1').append('<a href="#/'+asset_id+'/all">All files</a>' + ' > ' + '<span class="subhead"></span>');
    clearAll();
    $('.back-icon').show();
    $('.search-icon').show();
    $('.refresh-icon').show();
    step = 0;

    
    for (i = 0; i < categories.length; i++) {
      console.log(categories[i]);      
      var size = 0;
      for (k = 0; k < categories[i].items.length; k++) {
        if (categories[i].items[k].deleted == false) {

          size++;
          
        }
      }
      for (j = 0; j < categories[i].subcategories.length; j++) {
        if (categories[i].subcategories[j].deleted == false) {
          for (k = 0; k < categories[i].subcategories[j].items.length; k++) {
            if (categories[i].subcategories[j].items[k].deleted == false) {
              size++;
            }
          }
          
        }
        // size += categories[i].subcategories[j].items.length;
      }

      if (categories[i].deleted == false) {
        //assigned
        var inner_html = '<div class="dragit col-xs-12">' +
            '<div class="col-xs-6 no-pad assigned" type="category" assigned="true" data-index="' + i + '" onclick="subnav(' + i + ')">' +
              '<img class="folder-icon" src="images/folder.png">' + categories[i].name +
            '</div>' +
            '<div class="col-xs-4">' + categories[i].updatedAt + '</div>' +
            '<div class="col-xs-2">' + size + ' Files</div>' +
            '<img class="edit-icon" assigned="true" data-index="' + i + '" src="images/edit.png">' +
          '</div>';

        $('.content').append(inner_html);
      }
    }

    //unassigned subcategories
    for (i = 0; i < unassigned_subcategories.length; i++){
      if (unassigned_subcategories[i].deleted == false) {
        var size = 0;
        for (var k = 0; k < unassigned_subcategories[i].items.length; k++) {
          if (unassigned_subcategories[i].items[k].deleted == false) {
            size++;
          }
        }
        var inner_html = '<div class="dragit col-xs-12">' +
            '<div class="col-xs-6 no-pad" type="sub" assigned="false" data-index="' + i + '">' +
              '<img class="folder-icon" src="images/folder.png">' + unassigned_subcategories[i].name +
            '</div>' +
            '<div class="col-xs-4">' + unassigned_subcategories[i].updatedAt + '</div>' +
            '<div class="col-xs-2">' + size + ' Files</div>' +
            '<img class="edit-icon" assigned="false" type="sub" data-index="' + i + '" src="images/edit.png">' +
          '</div>';

        $('.uncontent').append(inner_html);
      }
    }

    //unassigned items
    for (i = 0; i < unassigned_items.length; i++) {
      if (unassigned_items[i].deleted == false) {
        // size = unassigned_items[i].filesize
        // var size  = '2M';
        var inner_html = '<div class="dragit col-xs-12">' +
            '<div class="col-xs-6 no-pad" type="item" assigned="false" data-index="' + i + '">' +
              '<img class="folder-icon" src="images/pdficon.png">' + unassigned_items[i].title +
            '</div>' +
            '<div class="col-xs-4">' + unassigned_items[i].updatedAt + '</div>' +
            '<div class="col-xs-2">' + unassigned_items[i].filesize + ' </div>' +
            '<img class="edit-icon edit-item" assigned="false" type="item" data-index="' + i + '" src="images/edit.png">' +
          '</div>';

        $('.uncontent').append(inner_html);
      }
    }

    $('.edit-icon').click(function() {
      // $(this).parent().parent().children().each(function() {
      //   $(this).children()[0].style = '';
      // })
      // $(this).parent().children()[0].style = 'color: #f00';
      if (!drag) {
        if ($(this).attr('assigned') == 'true') {
          $('body' ).data('category_index', $(this).attr('data-index'));
          var getdata = $('body').data();
          var category_index = getdata.category_index;
          $('#cat_name1').val(categories[category_index].name);
          $('#editcat').dialog(dialog_effect);
        } else {
          if ($(this).attr('type') == 'sub') {
            $('body' ).data('sub_index', $(this).attr('data-index'));
            var getdata = $('body').data();
            var sub_index = getdata.sub_index;
            $('#sub_name1').val(unassigned_subcategories[sub_index].name);
            $('#editsub').dialog(dialog_effect);
          } else if ($(this).attr('type') == 'item') {
            $('body' ).data('item_index', $(this).attr('data-index'));
            var getdata = $('body').data();
            var item_index = getdata.item_index;
            $('#file_name1').val(unassigned_items[item_index].title);
            $('#editfile').dialog(dialog_effect);
          }
        }
      }
    });

    var source, target, same = true;
    $('.no-pad').draggable({
      drag: function() {
        drag = true;
        var item;
        if ($(this).attr('type') == 'item') {
          item = unassigned_items[$(this).attr('data-index')];
        } else if ($(this).attr('type') == 'sub') {
          item = unassigned_subcategories[$(this).attr('data-index')];
        } else if ($(this).attr('type') == 'category') {
          item = categories[$(this).attr('data-index')];
        }
        source = {
          assigned: $(this).attr('assigned') == 'true',
          type: $(this).attr('type'),
          data: item,
          category_index: $(this).attr('data-index')
        };
      }
    });

    $('.no-pad').droppable({
      drop: function() {
        var item;
        if ($(this).attr('type') == 'item') {
          item = unassigned_items[$(this).attr('data-index')];
        } else if ($(this).attr('type') == 'sub') {
          item = unassigned_subcategories[$(this).attr('data-index')];
        } else if ($(this).attr('type') == 'category') {
          item = categories[$(this).attr('data-index')];
        }
        target = {
          assigned: $(this).attr('assigned') == 'true',
          type: $(this).attr('type'),
          data: item,
          category_index: $(this).attr('data-index')
        };
        same = false;
        dragAll(source, target, all);
      }
    });

    $('body').droppable({
      drop: function() {
        if (same) {
          refreshList();
        }
        same = true;
      }
    });
  };

  function all1() {
    all();
  }
  function all2() {
    all();
  }
  function all3() {
    all();
  }
  function all4() {
    all();
  }

  function sub() {
    $('.subhead').empty();
    $('.subcontent').empty();

    $('#header-sub').empty();
    $('#header-sub').append('<a href="#/'+ window.asset_id +'/all">All files</a>' + ' > ' + '<span class="subhead"></span>');
    $('#header-data').empty();
    $('#header-data').append('<a href="#/'+ window.asset_id +'/all">All files</a>' + ' > ' + '<span class="subhead"></span>' + ' > ' );

    // $('.head1').append('<a href="#/all">All files</a>' +' > ');
    //  <span class="subhead"></span>

    step = 1;
    var getcat = $( 'body' ).data();
    var category_index = getcat.category_index;
    var category = categories[category_index];
    $('.subhead').append(category.name);

    for (i = 0; i < category.subcategories.length; i++) {
      var size = 0;
      if (category.subcategories[i].deleted == false && category.subcategories[i].type == 'categories') {
        if (category.subcategories[i].items.length > 0) {
          for (k = 0; k < category.subcategories[i].items.length; k++) {
            if (category.subcategories[i].items[k].deleted == false) {
              size++;
            }
          }
        }
        var inner_html = '<div class="dragit col-xs-12">' +
            '<div class="col-xs-6 no-pad" type="sub" data-index="' + i + '" onclick="datanav(' + i + ')">' +
              '<img class="folder-icon" src="images/folder.png">' + category.subcategories[i].name +
            '</div>' +
            '<div class="col-xs-4">' + category.subcategories[i].updatedAt + '</div>' +
            '<div class="col-xs-2">' + size + ' Files</div>' +
            '<img class="edit-icon edit-sub" data-index="' + i + '" src="images/edit.png">' +
          '</div>';

        $('.subcontent').append(inner_html);
      }
    }

    for (i = 0; i < category.items.length; i++) {
      // var size = '2M';
      if (category.items[i].deleted == false) {
        var inner_html = '<div class="dragit col-xs-12">' +
            '<div class="col-xs-6 no-pad" type="item" data-index="' + i + '">' +
              '<a href="' + category.items[i].file.url + '">' +
                '<img class="folder-icon" src="images/pdficon.png">' + category.items[i].title +
              '</a>' +
            '</div>' +
            '<div class="col-xs-4">' + category.items[i].updatedAt + '</div>' +
            '<div class="col-xs-2">' + category.items[i].filesize + ' </div>' +
            '<img class="edit-icon edit-item" data-index="' + i + '" src="images/edit.png">' +
          '</div>';

        $('.subcontent').append(inner_html);
      }
    }

    //unassigned subcategories
    for (i = 0; i < unassigned_subcategories.length; i++){
      if (unassigned_subcategories[i].deleted == false) {
        var size = 0;
        for (var k = 0; k < unassigned_subcategories[i].items.length; k++) {
          if (unassigned_subcategories[i].items[k].deleted == false) {
            size++;
          }
        }
        var inner_html = '<div class="dragit col-xs-12">' +
            '<div class="col-xs-6 no-pad" type="sub" assigned="false" data-index="' + i + '">' +
              '<img class="folder-icon" src="images/folder.png">' + unassigned_subcategories[i].name +
            '</div>' +
            '<div class="col-xs-4">' + unassigned_subcategories[i].updatedAt + '</div>' +
            '<div class="col-xs-2">' + size + ' Files</div>' +
            '<img class="edit-icon" assigned="false" type="sub" data-index="' + i + '" src="images/edit.png">' +
          '</div>';

        $('.uncontent').append(inner_html);
      }
    }

    //unassigned items
    for (i = 0; i < unassigned_items.length; i++) {
      if (unassigned_items[i].deleted == false) {
        // size = unassigned_items[i].filesize
        // var size  = '2M';
        var inner_html = '<div class="dragit col-xs-12">' +
            '<div class="col-xs-6 no-pad" type="item" assigned="false" data-index="' + i + '">' +
              '<img class="folder-icon" src="images/pdficon.png">' + unassigned_items[i].title +
            '</div>' +
            '<div class="col-xs-4">' + unassigned_items[i].updatedAt + '</div>' +
            '<div class="col-xs-2">' + unassigned_items[i].filesize + ' </div>' +
            '<img class="edit-icon edit-item" assigned="false" type="item" data-index="' + i + '" src="images/edit.png">' +
          '</div>';

        $('.uncontent').append(inner_html);
      }
    }

    $('.edit-sub').click(function() {
      $('body' ).data('sub_index', $(this).attr('data-index'));

      var getdata = $('body').data();
      var category_index = getdata.category_index;
      var sub_index = getdata.sub_index;
      $('#sub_name1').val(categories[category_index].subcategories[sub_index].name);

      $('#editsub').dialog(dialog_effect);
    });

    $('.edit-item').click(function() {
      console.log('EDIT ITEM');
      $('body' ).data('sub_index', -1);
      $('body' ).data('item_index', $(this).attr('data-index'));

      var getdata = $('body').data();
      var category_index = getdata.category_index;
      var item_index = getdata.item_index;
      $('#file_name1').val(categories[category_index].items[item_index].title);

      $('#catselect').empty();
      console.log(categories);
      for (i = 0; i < categories.length; i++) {
        console.log(categories[i]);      
        $('#catselect').append($('<option>', {
            value: categories[i].name,
            text: categories[i].name
        }));
      }


      $('#editfile').dialog(dialog_effect);
    });

    var source, target;
    $('.no-pad').draggable({
      drag: function() {
        drag = true;
        var item;
        if ($(this).attr('type') == 'item') {
          item = category.items[$(this).attr('data-index')];
        } else if ($(this).attr('type') == 'sub') {
          item = category.subcategories[$(this).attr('data-index')];
        }
        source = {
          assigned: true,
          parent_id: category.id,
          type: $(this).attr('type'),
          data: item,
          category_index: category_index,
          sub_item_index: $(this).attr('data-index')
        };
      }
    });

    var same = true;
    $('.no-pad').droppable({
      drop: function() {
        var item;
        if ($(this).attr('type') == 'item') {
          item = category.items[$(this).attr('data-index')];
        } else if ($(this).attr('type') == 'sub') {
          item = category.subcategories[$(this).attr('data-index')];
        }
        target = {
          assigned: true,
          type: $(this).attr('type'),
          data: item,
          category_index: category_index,
          sub_item_index: $(this).attr('data-index')
        };
        same = false;
        dragAll(source, target, sub);
      }
    });

    $('body').droppable({
      drop: function() {
        if (same) {
          refreshList();
        }
        same = true;
      }
    });
  };

  function sub1() {
    sub();
  }
  function sub2() {
    sub();
  }
  function sub3() {
    sub();
  }
  function sub4() {
    sub();
  }


  function data() {
    $('.datacontent').empty();
    $('.datahead').empty();

    step = 2;
    var getdata = $( 'body' ).data();
    var category_index = getdata.category_index;
    var sub_index = getdata.sub_index;
    var category = categories[category_index];
    var sub_category = category.subcategories[sub_index];
   

    $('#header-sub').empty();
    $('#header-sub').append('<a href="#/'+ window.asset_id +'/all">All files</a>' + ' > ' + '<span class="subhead"></span>');
    $('#header-data').empty();
    $('#header-data').append('<a href="#/'+ window.asset_id +'/all">All files</a>' + ' > ' + '<a href="#/'+ window.asset_id +'/sub">' + category.name + '</a> > ' + sub_category.name);

   



    // $('.datahead').append('<a href="#/'+asset_id+'/sub">' + category.name + '</a> > ' + sub_category.name);

    for (i = 0; i < sub_category.items.length; i++) {
      if (sub_category.items[i].deleted == false) {
        var size = sub_category.items[i].filesize ? sub_category.items[i].filesize : '2M';
        var inner_html = '<div class="dragit col-xs-12">' +
            '<div class="col-xs-6 no-pad" data-index="' + i + '">' +
              '<a href="' + sub_category.items[i].file.url + '">' +
                '<img class="folder-icon" src="images/pdficon.png">' + sub_category.items[i].title +
              '</a>' +
            '</div>' +
            '<div class="col-xs-4">' + sub_category.items[i].updatedAt + '</div>' +
            '<div class="col-xs-2">' + size + '</div>' +
            '<img class="edit-icon" data-index="' + i + '" src="images/edit.png">' +
          '</div>';

        $('.datacontent').append(inner_html);
      }
    }

    // //unassigned subcategories
    // for (i = 0; i < unassigned_subcategories.length; i++){
    //   if (unassigned_subcategories[i].deleted == false) {
    //     var size = 0;
    //     for (var k = 0; k < unassigned_subcategories[i].items.length; k++) {
    //       if (unassigned_subcategories[i].items[k].deleted == false) {
    //         size++;
    //       }
    //     }
    //     var inner_html = '<div class="dragit col-xs-12">' +
    //         '<div class="col-xs-6 no-pad" type="sub" assigned="false" data-index="' + i + '">' +
    //           '<img class="folder-icon" src="images/folder.png">' + unassigned_subcategories[i].name +
    //         '</div>' +
    //         '<div class="col-xs-4">' + unassigned_subcategories[i].updatedAt + '</div>' +
    //         '<div class="col-xs-2">' + size + ' Files</div>' +
    //         '<img class="edit-icon" assigned="false" type="sub" data-index="' + i + '" src="images/edit.png">' +
    //       '</div>';

    //     $('.uncontent').append(inner_html);
    //   }
    // }

    //unassigned items
    for (i = 0; i < unassigned_items.length; i++) {
      if (unassigned_items[i].deleted == false) {
        // size = unassigned_items[i].filesize
        // var size  = '2M';
        var inner_html = '<div class="dragit col-xs-12">' +
            '<div class="col-xs-6 no-pad" type="item" assigned="false" data-index="' + i + '">' +
              '<img class="folder-icon" src="images/pdficon.png">' + unassigned_items[i].title +
            '</div>' +
            '<div class="col-xs-4">' + unassigned_items[i].updatedAt + '</div>' +
            '<div class="col-xs-2">' + unassigned_items[i].filesize + ' </div>' +
            '<img class="edit-icon edit-item" assigned="false" type="item" data-index="' + i + '" src="images/edit.png">' +
          '</div>';

        $('.uncontent').append(inner_html);
      }
    }

    $('.edit-icon').click(function() {
      console.log('EDIT ICON');
      $('body' ).data('item_index', $(this).attr('data-index'));

      var getdata = $('body').data();
      var category_index = getdata.category_index;
      var sub_index = getdata.sub_index;
      var item_index = getdata.item_index;
      $('#file_name1').val(categories[category_index].subcategories[sub_index].items[item_index].title);

      $('#editfile').dialog(dialog_effect);
    });

    var source, target;
    var same = true;
    $('.no-pad').draggable({
      drag: function() {
        var item = sub_category.items[$(this).attr('data-index')];
        source = {
          parent_id: sub_category.id,
          assigned: true,
          type: 'item',
          data: item,
          category_index: category_index,
          sub_index: sub_index,
          item_index: $(this).attr('data-index')
        };
      }
    });

    $('.no-pad').droppable({
      drop: function() {
        var item = sub_category.items[$(this).attr('data-index')];
        target = {
          assigned: true,
          type: 'item',
          data: item,
          category_index: category_index,
          sub_index: sub_index,
          item_index: $(this).attr('data-index')
        };
        same = false;
        dragAll(source, target, data);
      }
    });

    $('body').droppable({
      drop: function() {
        if (same) {
          refreshList();
        }
        same = true;
      }
    });
  };

  function data1() {
    data();
  }
  function data2() {
    data();
  }
  function data3() {
    data();
  }
  function data4() {
    data();
  }



  function dragAll(source, target, callback) {
    var url = API_HOST + '/api/v1/dragdrop';
    var data = {};

    if (source.type == target.type && source.assigned == true && target.assigned == true) {
      if (source.type == 'category' && target.type == 'category') {
        url += '/category';
        data = {
          asset_id: window.asset_id + '',
          dragged_id: source.data.id + '',
          dropped_id: target.data.id + ''
        };
        callback = all;
      } else if (source.type == 'sub' && target.type == 'sub') {
        url += '/subcategory';
        data = {
          parent_id: source.parent_id + '',
          dragged_id: source.data.id + '',
          dropped_id: target.data.id + ''
        };
      } else if (source.type == 'item' && target.type == 'item') {
        url += '/item';
        data = {
          category_id: source.parent_id + '',
          dragged_id: source.data.id + '',
          dropped_id: target.data.id + ''
        };
      }
      $.ajax({
        url: url,
        contentType: 'application/json',
        type: 'post',
        data: JSON.stringify(data),
        success: function(res) {
          // refreshAll(callback);
          changeSort(source, target);
        }
      });
    } else if (source.type == 'item' && target.type == 'sub' && source.assigned == true && target.assigned == true) {
      var dragItem = {
        id: source.data.id,
        category: {
          id: target.data.id,
          type: 'categories'
        }
      }
      yao.updateItem(dragItem).then(function (result) {
        // refreshAll(callback);
        if(result){
          source.data.sort = result.sort;
          source.data.updatedAt = result.updatedAt;
        }
        changeSort(source, target);
      }).catch(function (error) {
        alert('Can\'t update Item from API');
        console.log(error);
        refreshList();
      });
    } else if (source.type == 'item' && target.type == 'category') {
      var dragItem = {
        id: source.data.id,
        assigned: true,
        category: {
          id: target.data.id,
          type: 'categories'
        }
      }
      yao.updateItem(dragItem).then(function (result) {
        // refreshAll(callback);
        if(result){
          source.data.sort = result.sort;
          source.data.updatedAt = result.updatedAt;
        }        
        changeSort(source, target);
      }).catch(function (error) {
        alert('Can\'t update Item from API');
        console.log(error);
        refreshList();
      });
    } else if (source.type == 'sub' && target.type == 'category') {
      var dragSub = {
        id: source.data.id,
        assigned: true,
        parent: {
          id: target.data.id,
          type: 'categories'
        }
      }
      yao.updateCategory(dragSub).then(function (result) {
        // refreshAll(callback);
        if(result){
          source.data.sort = result.sort;
          source.data.updatedAt = result.updatedAt;
        }
        changeSort(source, target);
      }).catch(function (error) {
        alert('Can\'t update Item from API');
        console.log(error);
        refreshList();
      });
    } else {
      // refreshAll(callback);
      refreshList();
    }
  }

  function changeSort(source, target) {
    try {
      if (source.type == target.type && source.assigned == target.assigned == true) {
        if (source.type == 'category') {
          var sci = source.category_index * 1, tci = target.category_index * 1;
          if (sci < tci) {
            for (var i = sci + 1; i <= tci; i++) {
              var temp = categories[sci].sort;
              categories[sci].sort = categories[i].sort;
              categories[i].sort = temp;
            }
          } else {
            for (var i = sci - 1; i >= tci; i--) {
              var temp = categories[sci].sort;
              categories[sci].sort = categories[i].sort;
              categories[i].sort = temp;
            }
          }
          categories = sortList(categories);
        } else if (source.type == 'sub') {
          var ssi = source.sub_item_index * 1, tsi = target.sub_item_index * 1;
          var ci = source.category_index;
          if (ssi < tsi) {
            for (var i = ssi + 1; i <= tsi; i++) {
              var temp = categories[ci].subcategories[ssi].sort;
              categories[ci].subcategories[ssi].sort = categories[ci].subcategories[i].sort;
              categories[ci].subcategories[i].sort = temp;
            }
          } else {
            for (var i = ssi - 1; i >= tsi; i--) {
              var temp = categories[ci].subcategories[ssi].sort;
              categories[ci].subcategories[ssi].sort = categories[ci].subcategories[i].sort;
              categories[ci].subcategories[i].sort = temp;
            }
          }
          categories[ci].subcategories = sortList(categories[ci].subcategories);
        } else if (source.type == 'item') {
          if (step == 2) {
            var sii = source.item_index * 1, tii = target.item_index * 1;
            var ci = source.category_index, si = source.sub_index;
            if (sii < tii) {
              for (var i = sii + 1; i <= tii; i++) {
                var temp = categories[ci].subcategories[si].items[sii].sort;
                categories[ci].subcategories[si].items[sii].sort = categories[ci].subcategories[si].items[i].sort;
                categories[ci].subcategories[si].items[i].sort = temp;
              }
            } else {
              for (var i = sii - 1; i >= tii; i--) {
                var temp = categories[ci].subcategories[si].items[sii].sort;
                categories[ci].subcategories[si].items[sii].sort = categories[ci].subcategories[si].items[i].sort;
                categories[ci].subcategories[si].items[i].sort = temp;
              }
            }
            categories[ci].subcategories[si].items = sortList(categories[ci].subcategories[si].items);
          } else if (step == 1) {
            var sii = source.sub_item_index * 1, tii = target.sub_item_index * 1;
            var ci = source.category_index;
            if (sii < tii) {
              for (var i = sii + 1; i <= tii; i++) {
                var temp = categories[ci].items[sii].sort;
                categories[ci].items[sii].sort = categories[ci].items[i].sort;
                categories[ci].items[i].sort = temp;
              }
            } else {
              for (var i = sii - 1; i >= tii; i--) {
                var temp = categories[ci].items[sii].sort;
                categories[ci].items[sii].sort = categories[ci].items[i].sort;
                categories[ci].items[i].sort = temp;
              }
            }
            categories[ci].items = sortList(categories[ci].items);
          }
        }
      } else if (source.type == 'item' && target.type == 'sub' && source.assigned == target.assigned == true) {
        var ci = source.category_index, si = target.sub_item_index, ii = source.sub_item_index;
        categories[ci].subcategories[si].items.push(categories[ci].items[ii]);
        categories[ci].items.splice(ii, 1);
        categories[ci].subcategories[si].items = sortList(categories[ci].subcategories[si].items);
        categories[ci].items = sortList(categories[ci].items);
      } else if (source.type == 'item' && target.type == 'category') {
        var ci = target.category_index, ii = source.category_index;
        unassigned_items[ii].assigned = true;
        categories[ci].items.push(unassigned_items[ii]);
        unassigned_items.splice(ii, 1);
        categories[ci].items = sortList(categories[ci].items);
        unassigned_items = sortList(unassigned_items);
      } else if (source.type == 'sub' && target.type == 'category') {
        var ci = target.category_index, si = source.category_index;
        unassigned_subcategories[si].assigned = true;
        categories[ci].subcategories.push(unassigned_subcategories[si]);
        unassigned_subcategories.splice(si, 1);
        categories[ci].subcategories = sortList(categories[ci].subcategories);
        unassigned_subcategories = sortList(unassigned_subcategories);
      }
    } catch (e) {}
    // categories = sortAll(categories);
    drag = false;
    refreshList();
  }

  function clearAll() {
    $('.content').empty();
    $('.uncontent').empty();
    $('.subhead').empty();
    $('.subcontent').empty();
    $('.datacontent').empty();
    $('.datahead').empty();
  }

  $('#add_cat').click(createCategory);
  function createCategory() {
    var getdata = $('body').data();
    var cat_name = $('#cat_name').val();

    console.log('add category', window.asset_id, cat_name);
    yao.createCategory(window.asset_id, cat_name).then(function (result) {
      $('#addcat').dialog('close');
      categories.push(result);
      categories = sortList(categories);
      refreshList();
      // refreshAll(all);
    }).catch(function (error) {
      alert('Can\'t create category from API');
      console.log(error);
      refreshList();
    });
  }

  $('#edit_cat').click(editCategory);
  function editCategory() {
    var cat_name = $('#cat_name1').val();
    var getdata = $( 'body' ).data();
    var category_index = getdata.category_index;
    categories[category_index].name = cat_name;

    var category_id = categories[category_index].id;

    var newCat = {
      id: category_id,
      name: cat_name
    }
    yao.updateCategory(newCat).then(function (result) {
      $('#editcat').dialog('close');
      if(result){
        categories[category_index].updatedAt = result.updatedAt;
      }
      categories[category_index].name = cat_name;
      refreshList();
      // refreshAll(all);
    }).catch(function (error) {
      alert('Can\'t update category from API');
      console.log(error);
      refreshList();
    });
  }

  $('#delete_cat').click(deleteCategory);
  function deleteCategory() {
    var getdata = $( 'body' ).data();
    var category_index = getdata.category_index;
    var category_id = categories[category_index].id;

    var delCat = {
      id: category_id,
      deleted: true
    };
    yao.updateCategory(delCat).then(function (result) {
      $('#editcat').dialog('close');
      if (categories[category_index].subcategories.length > 0) {
        for (var i = 0; i < categories[category_index].subcategories.length; i++) {
          categories[category_index].subcategories[i].assigned = false;
          unassigned_subcategories.push(categories[category_index].subcategories[i]);
        }
        categories[category_index].subcategories.splice(0, categories[category_index].subcategories.length);
      }
      if (categories[category_index].items.length > 0) {
        for (var i = 0; i < categories[category_index].items.length; i++) {
          categories[category_index].items[i].assigned = false;
          unassigned_items.push(categories[category_index].items[i]);
        }
        categories[category_index].items.splice(0, categories[category_index].items.length);
      }
      categories[category_index].deleted = true;
      refreshList();
      // refreshAll(all);
    }).catch(function (error) {
      alert('Can\'t delete category from API');
      console.log(error);
      refreshList();
    });
  }

  $('#add_sub').click(createSubcategory);
  function createSubcategory() {
    var getdata = $('body').data();
    var category_index = getdata.category_index;
    var category_id = categories[category_index].id;
    var sub_name = $('#sub_name').val();

    yao.createSubCategory(window.asset_id, category_id, sub_name).then(function (result) {
      $('#addsub').dialog('close');
      categories[category_index].subcategories.push(result);
      categories[category_index].subcategories = sortList(categories[category_index].subcategories);
      refreshList();
      // refreshAll(sub);
    }).catch(function (error) {
      alert('Can\'t create subcategory from API');
      console.log(error);
      refreshList();
    });
  }

  $('#edit_sub').click(editSubcategory);
  function editSubcategory() {
    var sub_name = $('#sub_name1').val();
    var getdata = $( 'body' ).data();
    var category_index = getdata.category_index;
    var sub_index = getdata.sub_index;

    var sub_id, category_id;
    if (step == 1) {
      sub_id = categories[category_index].subcategories[sub_index].id;
      category_id = categories[category_index].id;
    } else if (step == 0) {
      sub_id = unassigned_subcategories[sub_index].id;
    }
    var newSub = {
      id: sub_id,
      name: sub_name
    }
    yao.updateCategory(newSub).then(function (result) {
      $('#editsub').dialog('close');
      if (step == 1) {
        categories[category_index].subcategories[sub_index].name = sub_name;
        if(result){
          categories[category_index].subcategories[sub_index].updatedAt = result.updatedAt;
        }
      } else if (step == 0) {
        unassigned_subcategories[sub_index].name = sub_name;
        if(result){
          unassigned_subcategories[sub_index].updatedAt = result.updatedAt;
        }
      }
      // if (step == 1) {
      //   refreshAll(sub);
      // } else if (step == 0) {
      //   refreshAll(all);
      // }
      refreshList();
    }).catch(function (error) {
      alert('Can\'t update subcategory from API');
      console.log(error);
      refreshList();
    });
  }

  $('#delete_sub').click(deleteSubcategory);
  function deleteSubcategory() {
    var getdata = $( 'body' ).data();
    var category_index = getdata.category_index;
    var sub_index = getdata.sub_index;
    var sub_id;
    if (step == 1) {
      sub_id = categories[category_index].subcategories[sub_index].id;
    } else if (step == 0) {
      sub_id = unassigned_subcategories[sub_index].id;
    }
    var delCat = {
      id: sub_id,
      deleted: true
    };
    yao.updateCategory(delCat).then(function (result) {
      $('#editsub').dialog('close');
      if (step == 1) {
        // refreshAll(sub);
        categories[category_index].subcategories[sub_index].deleted = true;
        if (categories[category_index].subcategories[sub_index].items.length > 0) {
          for (var i = 0; i < categories[category_index].subcategories[sub_index].items.length; i++) {
            categories[category_index].items.push(categories[category_index].subcategories[sub_index].items[i]);
            // categories[category_index].subcategories[sub_index].items[i].parent_id = categories[category_index].id;
          }
          categories[category_index].items = sortList(categories[category_index].items);
        }
      } else if (step == 0) {
        // refreshAll(all);
        unassigned_subcategories[sub_index].deleted = true;
        if (unassigned_subcategories[sub_index].items.length > 0) {
          for (var i = 0; i < unassigned_subcategories[sub_index].items.length; i++) {
            unassigned_subcategories[sub_index].items[i].assigned = false;
            unassigned_items.push(unassigned_subcategories[sub_index].items[i]);
          }
          unassigned_subcategories[sub_index].deleted = true;
          unassigned_subcategories.splice(sub_index, 1);
          unassigned_subcategories[sub_index].items = sortList(unassigned_subcategories[sub_index].items);
        }
      }
      refreshList();
    }).catch(function (error) {
      alert('Can\'t delete subcategory from API');
      console.log(error);
      refreshList();
    });
  }

  $('#add_file').click(addFile);
  function addFile() {
    var getdata = $( 'body' ).data();
    var category_index = getdata.category_index;
    var sub_index = getdata.sub_index;

    var category_id = null;
    try {
      category_id = categories[category_index].id;
    } catch (e) {}

    $('#assigned').val(true);
    if (step == 2) {
      category_id = categories[category_index].subcategories[sub_index].id;
    }
    if (step == 0) {
      $('#assigned').val(false);
    }
    $('#asset_id').val(window.asset_id);
    $('#category_id').val(category_id);
    var form = new FormData($('#addfile_form')[0]);
    var pdf_title = $('#item_title').val();
    var pdf_file = $('#item_file').val();
    if(pdf_title == ''){
      alert('Please input name');
      return false;
    }
    if(pdf_file == ''){
      alert('Please choose pdf file to upload');
      return false;
    }

    $('#addfile').dialog('close');
    
    $.ajax({
      url: API_HOST + '/api/v1/items',
      method: 'POST',
      // dataType: 'json',
      data: form,
      processData: false,
      contentType: false,
      success: function(result) {
        // alert('Your file has been uploaded.');
        $('#msg_info').modal();
        console.log(result);
        var item = {};
        try {
          item = result.data.attributes;
          item['id'] = result.data.id;
          item['createdAt'] = item['created-at'];
          item['updatedAt'] = item['updated-at'];

          if (step == 2) {
            categories[category_index].subcategories[sub_index].items.push(item);
            categories[category_index].subcategories[sub_index].items = sortList(categories[category_index].subcategories[sub_index].items);
          } else if (step == 1){
            categories[category_index].items.push(item);
            categories[category_index].items = sortList(categories[category_index].items);
          } else {
            unassigned_items.push(item);
            unassigned_items = sortList(unassigned_items);
          }
        } catch (e) {}
        // $('#addfile').dialog('close');
        refreshList();
      },
      error: function(er) {
        alert('Can\'t create item from API');
      }
    });
  }
  
  $('#add_file_more').click(addFile);
  function addFile() {
    var getdata = $( 'body' ).data();
    var category_index = getdata.category_index;
    var sub_index = getdata.sub_index;

    var category_id = null;
    try {
      category_id = categories[category_index].id;
    } catch (e) {}

    $('#assigned').val(true);
    if (step == 2) {
      category_id = categories[category_index].subcategories[sub_index].id;
    }
    if (step == 0) {
      $('#assigned').val(false);
    }
    $('#asset_id').val(window.asset_id);
    $('#category_id').val(category_id);
    var form = new FormData($('#addfile_form')[0]);
    var pdf_title = $('#item_title').val();
    var pdf_file = $('#item_file').val();
    if(pdf_title == ''){
      alert('Please input name');
      return false;
    }
    if(pdf_file == ''){
      alert('Please choose pdf file to upload');
      return false;
    }

    // $('#addfile').dialog('close');
    $('#item_title').val('');
    $('#item_file').val('');
    $('#item_tags').val('');
    
    
    $.ajax({
      url: API_HOST + '/api/v1/items',
      method: 'POST',
      // dataType: 'json',
      data: form,
      processData: false,
      contentType: false,
      success: function(result) {
        // alert('Your file has been uploaded.');
        $('#msg_info').modal();
        console.log(result);
        var item = {};
        try {
          item = result.data.attributes;
          item['id'] = result.data.id;
          item['createdAt'] = item['created-at'];
          item['updatedAt'] = item['updated-at'];

          if (step == 2) {
            categories[category_index].subcategories[sub_index].items.push(item);
            categories[category_index].subcategories[sub_index].items = sortList(categories[category_index].subcategories[sub_index].items);
          } else if (step == 1){
            categories[category_index].items.push(item);
            categories[category_index].items = sortList(categories[category_index].items);
          } else {
            unassigned_items.push(item);
            unassigned_items = sortList(unassigned_items);
          }
        } catch (e) {}
        // $('#addfile').dialog('close');
        refreshList();
      },
      error: function(er) {
        alert('Can\'t create item from API');
      }
    });
  }
  $('#edit_file').click(editFile);
  function editFile() {
    var file_name = $('#file_name1').val();
    var file_tags = $('#file_tags1').val();
    var getdata = $( 'body' ).data();
    var category_index = getdata.category_index;
    var sub_index = getdata.sub_index;
    var item_index = getdata.item_index;

    var item_id;
    if (step == 2) {
      item_id = categories[category_index].subcategories[sub_index].items[item_index].id;
    } else if (step == 1){
      item_id = categories[category_index].items[item_index].id;
    } else {
      item_id = unassigned_items[item_index].id;
    }

    var item = {
      id: item_id,
      title: file_name
    }
    yao.updateItem(item).then(function (result) {
      $('#editfile').dialog('close');
      if (step == 2) {
        categories[category_index].subcategories[sub_index].items[item_index].title = file_name;
        if(result.updatedAt){
          categories[category_index].subcategories[sub_index].items[item_index].updatedAt = result.updatedAt;
        }
        // refreshAll(data);
      } else if (step == 1){
        categories[category_index].items[item_index].title = file_name;
        if(result.updatedAt){
          categories[category_index].items[item_index].updatedAt = result.updatedAt;
        }
        // refreshAll(sub);
      } else {
        unassigned_items[item_index].title = file_name;
        if(result.updatedAt){
          unassigned_items[item_index].updatedAt = result.updatedAt;
        }
        // refreshAll(all);
      }
      refreshList();
      
    }).catch(function (error) {
      alert('Can\'t update item from API');
      console.log(error);
      refreshList();
    });

  }

  $('#delete_file').click(deleteItem);
  function deleteItem() {
    var getdata = $( 'body' ).data();
    var category_index = getdata.category_index;
    var sub_index = getdata.sub_index;
    var item_index = getdata.item_index;

    var item_id;
    if (step == 2) {
      item_id = categories[category_index].subcategories[sub_index].items[item_index].id;
    } else if (step == 1) {
      item_id = categories[category_index].items[item_index].id;
    } else if (step == 0) {
      item_id = unassigned_items[item_index].id;
    }

    var delItem = {
      id: item_id,
      deleted: true
    };
    yao.updateItem(delItem).then(function (result) {
      $('#editfile').dialog('close');
      if (step == 2) {
        // refreshAll(data);
        categories[category_index].subcategories[sub_index].items[item_index].deleted = true;
      } else if (step == 1) {
        // refreshAll(sub);
        categories[category_index].items[item_index].deleted = true;
      } else if (step == 0) {
        // refreshAll(all);
        unassigned_items[item_index].deleted = true;
      }
      refreshList();
    }).catch(function (error) {
      alert('Can\'t delete item from API');
      console.log(error);
      refreshList();
    });
  }

  $('.refresh-icon').click(function() {
    if (step == 0) {
      refreshAll(all);
    } else if (step == 1) {
      refreshAll(sub);
    } else if (step == 2) {
      refreshAll(data);
    }
  })

  var allroutes = function() {
    console.log('Whole url', window.location.hash);
    var start = '#/'; var startIndex = window.location.hash.indexOf(start);
    var data = window.location.hash.slice(startIndex+start.length,window.location.hash.length);
    var main = data.indexOf('/');
    if( main !== -1 ) {
      route = data.slice(main+1, data.length);      
      data = data.slice(0, main);
      $('body' ).data('asset_id', data);
    }
    else {
      route = data;
      // data.slice(main, data.length);
    }


    // var route = window.location.hash.slice(4);
    var sections = $('section');
    var section;
    console.log('route', route);
    console.log('data', data);

    // $('')

    // refreshAll();

    section = sections.filter('[data-route=' + route + ']');

    if (section.length) {
      sections.hide(0);
      section.show(0);
    }
  };

  var routes = {
    '/main': main,
    // '/all': all,
    // '/sub': sub,
    // '/data': data,
    '/1/all': all1,
    '/1/sub': sub1,
    '/1/data': data1,

    '/2/all': all2,
    '/2/sub': sub2,
    '/2/data': data2,

    '/3/all': all3,
    '/3/sub': sub3,
    '/3/data': data3,

    '/4/all': all4,
    '/4/sub': sub4,
    '/4/data': data4
  };

  var router = Router(routes);

  function sortList(sort_list) {
    var list = sort_list;
    if (!list) {
      return;
    }

    for (var i = 0; i < list.length; i++) {
      for (var j = i; j < list.length; j++) {
        if (list[i].sort >= list[j].sort) {
          var temp = list[i];
          list[i] = list[j];
          list[j] = temp;
        }
      }
    }
    return list;
  }

  function sortAll(categories) {
    var category_list = categories;
    for (var i = 0; i < category_list.length; i++) {
      if (category_list[i].subcategories.length > 0) {
        for (var j = 0; j < category_list[i].subcategories.length; j++) {
          category_list[i].subcategories[j].items = sortList(category_list[i].subcategories[j].items);
        }
      }
      category_list[i].items = sortList(category_list[i].items);
      category_list[i].subcategories = sortList(category_list[i].subcategories);
    }
    category_list = sortList(category_list);
    return category_list;
  }

  window.refreshAll = function(callback) {
    console.log('window.asset_id', window.asset_id);

    //
    clearAll();
    yao.assetData(window.asset_id).then(function (assetData) {
      categories = assetData.categories;
      categories = sortAll(categories);

      console.log(categories);
      for( var c = 0; c < categories.length; c++ ) {
        for( var s = 0; s < categories[c].subcategories.length; s++ ) {
            for( var si = 0; si < categories[c].subcategories[s].items.length; si++ ) {
                var fileSI = categories[c].subcategories[s].items[si].file.url;
                // console.log(fileSI);
                categories[c].subcategories[s].items[si].file.url = API_HOST + fileSI;
            } 
        }
        for( var i = 0; i < categories[c].items.length; i++ ) {
            var fileI = categories[c].items[i].file.url;
            // console.log(fileI);
            categories[c].items[i].file.url = API_HOST + fileI;
        } 
    }  
    // ask Seiji if this api is returning valid data from asset # 
      yao.getUnassignedSubCategories(window.asset_id).then(function (data) {
        unassigned_subcategories = data;

        yao.getUnassignedItems(window.asset_id).then(function (data) {
          unassigned_items = data;
          if (callback) {
            clearAll();
            callback();
            drag = false;
          } else {
            // router.configure({
            //   on: allroutes
            // });
            // router.init();
          }
        }).catch(function (error) {
          alert('Can\'t get UnassignedItems from API');
          console.log(error);
        });

      }).catch(function (error) {
        alert('Can\'t get UnassignedSubCategories from API');
        console.log(error);
      });

    }).catch(function (error) {
      // alert('Can\'t get categories from API');
      // alert(error);
      clearAll();
      if( error ) {
        console.log(error);
        if( error[0].title === 'Record not found' ) {
          categories = [];
          // router.configure({
          //   on: allroutes
          // });
          // router.init();
        }
        else {
          alert('Cannot connect to server, please try again');
        }
      }
      else {
        alert('Cannot connect to server, please try again');
      }
    });
  };

  function refreshList() {
    clearAll();
    if (step == 0) {
      all();
    } else if (step == 1) {
      sub();
    } else if (step == 2) {
      data(); 
    }
    drag = false;
  }

  window.refreshAll();
  router.configure({
    on: allroutes
  });
  router.init();
});

window.location = '#/main';

$('.search-icon').click(function() {
  $('.searchbox').slideToggle();
});

$('.newcat-icon').click(function() {
  $('#cat_name').val('');
  $('#addcat').dialog(dialog_effect);
});

$('.newfile-icon').click(function() {
  $('#asset_id').val('');
  $('#category_id').val('');
  $('#item_title').val('');
  $('#item_file').val('');
  $('#item_tags').val('');
  $('#addfile').dialog(dialog_effect);
});

$('.newsub-icon').click(function() {
    $('#sub_name').val('');
    $('#addsub').dialog(dialog_effect);
});

function subnav(index) {
  if (!drag) {
    $('body' ).data('category_index', index);
    window.location = '#/'+ window.asset_id +'/sub';
  }
}

function datanav(intodata) {
  if (!drag) {
    $('body' ).data('sub_index', intodata);
    window.location = '#/'+ asset_id +'/data';
  }
}

function back() {
  $('.content').empty();
  $('.uncontent').empty();
  $('.subhead').empty();
  $('.subcontent').empty();
  $('.datacontent').empty();
  $('.datahead').empty();

  var newloc = window.location.hash;
  console.log('back', newloc);

  if (newloc == '#/'+ window.asset_id +'/sub') {
    window.location = '#/'+ window.asset_id +'/all';
  }

  if (newloc == '#/'+ window.asset_id +'/all') {
    window.location = '#/main';
  }

  if (newloc == '#/'+ asset_id +'/data') {
    window.location = '#/'+ asset_id +'/sub';
  }
}

$(window).on('hashchange', function() {

  var newloc = window.location.hash;

  if (newloc == '#/main') {
    $('.content').empty();
    $('.uncontent').empty();
    $('.subhead').empty();
    $('.subcontent').empty();
    $('.datahead').empty();

  }

  if (newloc == '#/1/all') {
    $('.content').empty();
    $('.subhead').empty();
    $('.subcontent').empty();
    $('.datacontent').empty();
    $('.datahead').empty();
    window.asset_id = 1;
    $('body' ).data('asset_id', window.asset_id);
    window.refreshAll();
  }
  if (newloc == '#/2/all') {
    $('.content').empty();
    $('.subhead').empty();
    $('.subcontent').empty();
    $('.datacontent').empty();
    $('.datahead').empty();
    window.asset_id = 2;
    $('body' ).data('asset_id', window.asset_id);
    window.refreshAll();
  }
  if (newloc == '#/3/all') {
    $('.subhead').empty();
    $('.subcontent').empty();
    $('.datacontent').empty();
    $('.datahead').empty();
    window.asset_id = 3;
    $('body' ).data('asset_id', window.asset_id);
    window.refreshAll();
  }
  if (newloc == '#/4/all') {
    $('.subhead').empty();
    $('.subcontent').empty();
    $('.datacontent').empty();
    $('.datahead').empty();
    window.asset_id = 4;
    $('body' ).data('asset_id', window.asset_id);
    window.refreshAll();
  }

  if (newloc == '#/1/sub') {
    $('.content').empty();
    $('.uncontent').empty();
    $('.datacontent').empty();
    $('.datahead').empty();
    window.refreshAll();
  }
  if (newloc == '#/2/sub') {
    $('.content').empty();
    $('.uncontent').empty();
    $('.datacontent').empty();
    $('.datahead').empty();
    window.refreshAll();
  }
  if (newloc == '#/3/sub') {
    $('.content').empty();
    $('.uncontent').empty();
    $('.datacontent').empty();
    $('.datahead').empty();
    window.refreshAll();
  }
  if (newloc == '#/4/sub') {
    $('.content').empty();
    $('.uncontent').empty();
    $('.datacontent').empty();
    $('.datahead').empty();
    window.refreshAll();
  }

  if (newloc == '#/1/data') {
    $('.content').empty();
    $('.uncontent').empty();
    $('.subhead').empty();
    $('.subcontent').empty();
    window.refreshAll();
  }
  if (newloc == '#/2/data') {
    $('.content').empty();
    $('.uncontent').empty();
    $('.subhead').empty();
    $('.subcontent').empty();
    window.refreshAll();
  }
  if (newloc == '#/3/data') {
    $('.content').empty();
    $('.uncontent').empty();
    $('.subhead').empty();
    $('.subcontent').empty();
    window.refreshAll();
  }
  if (newloc == '#/4/data') {
    $('.content').empty();
    $('.uncontent').empty();
    $('.subhead').empty();
    $('.subcontent').empty();
    window.refreshAll();
  }

});
