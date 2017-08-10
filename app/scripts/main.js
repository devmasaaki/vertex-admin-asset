
$('body' ).data('asset_id', 1);
var asset_id = 1;
var categories = [];
var unassigned_subcategories = [];
var unassigned_items = [];
var yao = new Yao.YaoApi();
var step = 0;

$('document').ready(function() {
  function main() {
    $('.back-icon').hide();
    $('.search-icon').hide();
    $('.refresh-icon').hide();
    $('.overlay').delay(500).fadeOut('slow', function() {});
  };

  function all() {
    $('.back-icon').show();
    $('.search-icon').show();
    $('.refresh-icon').show();
    step = 0;

    for (i = 0; i < categories.length; i++) {
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
        $('.content').append('<div class="dragit col-xs-12"><div class="col-xs-6 no-pad assigned" type="category" dataid="' + i + '" onclick="subnav(' + i + ')"><img class="folder-icon" src="images/folder.png">' + categories[i].name + '</div><div class="col-xs-4">' + categories[i].createdAt + '</div><div class="col-xs-2">' + size + ' Files</div><img class=" edit-icon" catindex="' + i + '" src="images/edit.png"></div>');
      } else {
        //unassigned
      }
    }

    //unassigned subcategories
    for (i = 0; i < unassigned_subcategories.length; i++){
      var size = unassigned_subcategories[i].items.length
      $('.uncontent').append('<div class="dragit col-xs-12"><div class="col-xs-6 no-pad unassigned" type="sub" dataid="' + i + '"><img class="folder-icon" src="images/folder.png">' + unassigned_subcategories[i].name + '</div><div class="col-xs-4">' + unassigned_subcategories[i].createdAt + '</div><div class="col-xs-2">' + size + ' Files</div><img class=" edit-icon" catindex="' + i + '" src="images/edit.png"></div>');
    }

    //unassigned items
    for (i = 0; i < unassigned_items.length; i++){
      // size = unassigned_items[i].filesize
      var size  = '2M'
      $('.uncontent').append('<div class="dragit col-xs-12"><div class="col-xs-6 no-pad unassigned" type="item" dataid="' + i + '"><img class="folder-icon" src="images/pdficon.png">' + unassigned_items[i].title + '</div><div class="col-xs-4">' + unassigned_items[i].createdAt + '</div><div class="col-xs-2">' + size + ' </div><img itemindex="' + i + '" class="edit-icon edit-item" itemindex="' + i + '" src="images/edit.png"></div>');
    }

    $('.edit-icon').click(function() {
      $('body' ).data('cat_id', $(this).attr('catindex'));
      var getdata = $( 'body' ).data();
      var cat_id = getdata.cat_id;
      $('#cat_name1').val(categories[cat_id].name);

      $('#editcat').dialog();
    });

    var source, target;
    $( '.no-pad.unassigned' ).draggable({
      drag: function() {
        source = $(this);
      }
    });

    $( '.no-pad.assigned' ).droppable({
      drop: function() {
        target = $(this);
        if ((source.attr('type') == 'item' || source.attr('type') == 'sub') && target.attr('type') == 'category') {
          var getdata = $( 'body' ).data();
          var cat_id = target.attr('dataid');
          var sub_item_id = source.attr('dataid');

          var category = categories[cat_id];
          var sub_item;
          if (source.attr('type') == 'item') {
            sub_item = unassigned_items[sub_item_id];

            var dragItem = {
              id: sub_item.id,
              assigned:true,
              //title: newTitle
              category: {
                id: category.id, //category_id
                type: 'categories'
              }
            }
            yao.updateItem(dragItem).then(function (result) {
              refreshAll(all);
            }).catch(function (error) {
              alert('Can\'t update Item from API');
              console.log(error);
            });
          } else if (source.attr('type') == 'sub') {
            sub_item = unassigned_subcategories[sub_item_id];
            var dragSub = {
              id: sub_item.id,
              assigned: true,
              //title: newTitle
              parent: {
                id: category.id, //category_id
                type: 'categories'
              }
            }
            console.log('dragitem')
            console.log(dragSub);
            yao.updateCategory(dragSub).then(function (result) {
              refreshAll(all);
            }).catch(function (error) {
              alert('Can\'t update Item from API');
              console.log(error);
            });
          }
        }
      }
    });
  };

  function sub() {
    step = 1;
    var getcat = $( 'body' ).data();
    var cat_id = getcat.cat_id;
    var category = categories[cat_id];
    $('.subhead').append(category.name);

    for (i = 0; i < category.subcategories.length; i++) {
      var size = 0;
      for (k = 0; k < category.subcategories[i].items.length; k++) {
        if (category.subcategories[i].items[k].deleted == false) {
          size++;
        }
      }
      if (category.subcategories[i].deleted == false) {
        $('.subcontent').append('<div class="dragit col-xs-12"><div class="col-xs-6 no-pad" type="sub" dataid="' + i + '" onclick="datanav(' + i + ')"><img class="folder-icon" src="images/folder.png">' + category.subcategories[i].name + '</div><div class="col-xs-4">' + category.subcategories[i].createdAt + '</div><div class="col-xs-2">' + size + ' Files</div><img subindex="' + i + '" class="edit-icon edit-sub" src="images/edit.png"></div>');
      }
    }

    for (i = 0; i < category.items.length; i++) {
      var size = '2M';
      if (category.items[i].deleted == false) {
        $('.subcontent').append('<div class="dragit col-xs-12"><div class="col-xs-6 no-pad" type="item" dataid="' + i + '"><a href="' + category.items[i].file.url + '"><img class="folder-icon" src="images/pdficon.png">' + category.items[i].title + '</a></div><div class="col-xs-4">' + category.items[i].createdAt + '</div><div class="col-xs-2">' + size + ' </div><img itemindex="' + i + '" class="edit-icon edit-item" itemindex="' + i + '" src="images/edit.png"></div>');
      }
      // $('.subcontent').append('<div class="dragit col-xs-12"><a href="pdfurl"><div class="col-xs-6 no-pad"><img class="folder-icon" src="images/pdficon.png">' + category.items[i].title + '</div></a><div class="col-xs-4">' + category.items[i].createdAt + '</div><div class="col-xs-2">' + category.items[i].content + '</div><img class=" edit-icon" src="images/edit.png"></div>');
    }

    $('.edit-sub').click(function() {
      $('body' ).data('sub_id', $(this).attr('subindex'));

      var getdata = $('body').data();
      var cat_id = getdata.cat_id;
      var sub_id = getdata.sub_id;
      $('#sub_name1').val(categories[cat_id].subcategories[sub_id].name);

      $('#editsub').dialog();
    });

    $('.edit-item').click(function() {
      $('body' ).data('sub_id', -1);
      $('body' ).data('item_id', $(this).attr('itemindex'));

      var getdata = $('body').data();
      var cat_id = getdata.cat_id;
      var item_id = getdata.item_id;
      $('#file_name1').val(categories[cat_id].items[item_id].title);

      $('#editfile').dialog();
    });

    var source, target;
    $( '.no-pad[type="item"]' ).draggable({
      drag: function() {
        source = $(this);
      }
    });

    $( '.no-pad' ).droppable({
      drop: function() {
        target = $(this);
        if (source.attr('type') == 'item' && target.attr('type') == 'sub') {
          var getdata = $( 'body' ).data();
          var cat_id = getdata.cat_id;
          var sub_id = target.attr('dataid');
          var item_id = source.attr('dataid');

          var category = categories[cat_id];

          var item = category.items[item_id];
          var subcat = category.subcategories[sub_id];

          var dragItem = {
            id: item.id,
            //title: newTitle
            category: {
              id: subcat.id, //category_id
              type: 'categories'
            }
          }
          yao.updateItem(dragItem).then(function (result) {
            refreshAll(sub);
          }).catch(function (error) {
            alert('Can\'t update Item from API');
            console.log(error);
          });
        }
      }
    });
  };

  function data() {
    step = 2;
    var getdata = $( 'body' ).data();
    var cat_id = getdata.cat_id;
    var sub_id = getdata.sub_id;
    var category = categories[cat_id];
    var sub_category = category.subcategories[sub_id];

    $('.datahead').append('<a href="#/sub">' + category.name + '</a> > ' + sub_category.name);

    for (i = 0; i < sub_category.items.length; i++) {
      if (sub_category.items[i].deleted == false) {
        var size = sub_category.items[i].size ? sub_category.items[i].size : '2M';
        $('.datacontent').append('<div class="dragit col-xs-12"><a href="' + sub_category.items[i].file.url + '"><div class="col-xs-6 no-pad"><img class="folder-icon" src="images/pdficon.png">' + sub_category.items[i].title + '</div></a><div class="col-xs-4">' + sub_category.items[i].createdAt + '</div><div class="col-xs-2">' + size + '</div><img class="edit-icon" itemindex="' + i + '" src="images/edit.png"></div>');
      }
    }

    $('.edit-icon').click(function() {
      $('body' ).data('item_id', $(this).attr('itemindex'));

      var getdata = $('body').data();
      var cat_id = getdata.cat_id;
      var sub_id = getdata.sub_id;
      var item_id = getdata.item_id;
      $('#file_name1').val(categories[cat_id].subcategories[sub_id].items[item_id].title);

      $('#editfile').dialog();
    });
  };

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
    var getdata = $( 'body' ).data();
    var asset_id = getdata.asset_id;
    var cat_name = $('#cat_name').val();

    yao.createCategory(asset_id, cat_name).then(function (result) {
      $('#addcat').dialog('close');
      refreshAll(all);
    }).catch(function (error) {
      alert('Can\'t create category from API');
      console.log(error);
    });
  }

  $('#edit_cat').click(editCategory);
  function editCategory() {
    var cat_name = $('#cat_name1').val();
    var getdata = $( 'body' ).data();
    var cat_id = getdata.cat_id;
    categories[cat_id].name = cat_name;

    cat_id = categories[cat_id].id;

    var newCat = {
      id: cat_id,
      name: cat_name
    }
    yao.updateCategory(newCat).then(function (result) {
      $('#editcat').dialog('close');
      refreshAll(all);
    }).catch(function (error) {
      alert('Can\'t update category from API');
      console.log(error);
    });
  }

  $('#delete_cat').click(deleteCategory);
  function deleteCategory() {
    var getdata = $( 'body' ).data();
    var cat_id = getdata.cat_id;
    cat_id = categories[cat_id].id;

    var delCat = {
      id: cat_id,
      deleted: true
    };
    yao.updateCategory(delCat).then(function (result) {
      $('#editcat').dialog('close');
      refreshAll(all);
    }).catch(function (error) {
      alert('Can\'t delete category from API');
      console.log(error);
    });
  }

  $('#add_sub').click(createSubcategory);
  function createSubcategory() {
    var getdata = $( 'body' ).data();
    var asset_id = getdata.asset_id;
    var cat_index = getdata.cat_id;
    var cat_id = categories[cat_index].id;
    var sub_name = $('#sub_name').val();

    yao.createSubCategory(asset_id, cat_id, sub_name).then(function (result) {
      $('#addsub').dialog('close');
      refreshAll(sub);
    }).catch(function (error) {
      alert('Can\'t create subcategory from API');
      console.log(error);
    });
  }

  $('#edit_sub').click(editSubcategory);
  function editSubcategory() {
    var sub_name = $('#sub_name1').val();
    var getdata = $( 'body' ).data();
    var cat_id = getdata.cat_id;
    var sub_id = getdata.sub_id;
    categories[cat_id].subcategories[sub_id].name = sub_name;

    sub_id = categories[cat_id].subcategories[sub_id].id;
    cat_id = categories[cat_id].id;

    var newSub = {
      id: sub_id,
      name: sub_name,
      parent:{
        id : cat_id,
        type: 'categories'
      }
    }
    yao.updateCategory(newSub).then(function (result) {
      $('#editsub').dialog('close');
      refreshAll(sub);
    }).catch(function (error) {
      alert('Can\'t update subcategory from API');
      console.log(error);
    });
  }

  $('#delete_sub').click(deleteSubcategory);
  function deleteSubcategory() {
    var getdata = $( 'body' ).data();
    var cat_id = getdata.cat_id;
    var sub_id = getdata.sub_id;

    sub_id = categories[cat_id].subcategories[sub_id].id;

    var delCat = {
      id: sub_id,
      deleted: true
    };
    yao.updateCategory(delCat).then(function (result) {
      $('#editsub').dialog('close');
      refreshAll(sub);
    }).catch(function (error) {
      alert('Can\'t delete subcategory from API');
      console.log(error);
    });
  }

  $('#add_file').click(addFile);
  function addFile() {
    var getdata = $( 'body' ).data();
    var asset_id = getdata.asset_id;
    var cat_id = getdata.cat_id;
    var sub_id = getdata.sub_id;

    var category_id = 0;
    try {
      category_id = categories[cat_id].id;
    } catch (e) {}

    if (step == 2) {
      category_id = categories[cat_id].subcategories[sub_id].id;
    }
    $('#asset_id').val(asset_id);
    $('#category_id').val(category_id);
    var form = new FormData($('#addfile_form')[0]);
    $.ajax({
      url: 'http://192.168.0.124:3001/api/v1/items',
      method: 'POST',
      // dataType: 'json',
      data: form,
      processData: false,
      contentType: false,
      success: function(result) {
        if (step == 2) {
          refreshAll(data);
        } else {
          refreshAll(sub);
        }
      },
      error: function(er) {
        alert('Can\'t create item from API');
      }
    });

    $('#addfile').dialog('close');
  }

  $('#edit_file').click(editFile);
  function editFile() {
    var file_name = $('#file_name1').val();
    var file_tags = $('#file_tags1').val();
    var getdata = $( 'body' ).data();
    var cat_id = getdata.cat_id;
    var sub_id = getdata.sub_id;
    var item_index = getdata.item_id;

    var item_id;
    if (step == 2) {
      item_id = categories[cat_id].subcategories[sub_id].items[item_index].id;
      categories[cat_id].subcategories[sub_id].items[item_index].title = file_name;
    } else {
      item_id = categories[cat_id].items[item_index].id;
      categories[cat_id].items[item_index].title = file_name;
    }
    cat_id = categories[cat_id].id;

    var item = {
      id: item_id,
      title: file_name
    }
    yao.updateItem(item).then(function (result) {
      $('#editfile').dialog('close');
      if (step == 2) {
        refreshAll(data);
      } else {
        refreshAll(sub);
      }
    }).catch(function (error) {
      alert('Can\'t update item from API');
      console.log(error);
    });
  }

  $('#delete_file').click(deleteItem);
  function deleteItem() {
    var getdata = $( 'body' ).data();
    var cat_id = getdata.cat_id;
    var sub_id = getdata.sub_id;
    var item_index = getdata.item_id;

    var item_id;
    if (step == 2) {
      item_id = categories[cat_id].subcategories[sub_id].items[item_index].id;
    } else {
      item_id = categories[cat_id].items[item_index].id;
    }

    var delItem = {
      id: item_id,
      deleted: true
    };
    yao.updateItem(delItem).then(function (result) {
      $('#editfile').dialog('close');
      if (step == 2) {
        refreshAll(data);
      } else {
        refreshAll(sub);
      }
    }).catch(function (error) {
      alert('Can\'t delete item from API');
      console.log(error);
    });
  }

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

  function refreshAll(callback) {
    yao.assetData(1).then(function (assetData) {
      categories = assetData.categories;
      console.log('categories1');
      console.log(categories);

      yao.getUnassignedSubCategories(1).then(function (data) {
        unassigned_subcategories = data;
        console.log('unassigned_subcategories2');
        console.log(unassigned_subcategories);

        yao.getUnassignedItems(1).then(function (data) {
          unassigned_items = data;
          if (callback) {
            clearAll();
            callback();
          } else {
            router.configure({
              on: allroutes
            });
            router.init();
          }
          console.log('unassigned_items3');
          console.log(unassigned_items);
        }).catch(function (error) {
          alert('Can\'t get UnassignedItems from API');
          console.log(error);
        });

      }).catch(function (error) {
        alert('Can\'t get UnassignedSubCategories from API');
        console.log(error);
      });

    }).catch(function (error) {
      alert('Can\'t get categories from API');
      console.log(error);
    });
  }

  refreshAll();
});

window.location = '#/main';

$('.search-icon').click(function() {
  $('.searchbox').slideToggle();
});

$('.newcat-icon').click(function() {
  $('#addcat').dialog();
});

$('.newfile-icon').click(function() {
  $('#asset_id').val('');
  $('#category_id').val('');
  $('#item_title').val('');
  $('#item_file').val('');
  $('#item_tags').val('');
  $('#addfile').dialog();
});

$('.newsub-icon').click(function() {
    $('#addsub').dialog();
});

function subnav(index) {
  $('body' ).data('cat_id', index);
  window.location = '#/sub';
}

function datanav(intodata) {
  $('body' ).data('sub_id', intodata);
  window.location = '#/data';
}

function back() {
  $('.content').empty();
  $('.uncontent').empty();
  $('.subhead').empty();
  $('.subcontent').empty();
  $('.datacontent').empty();
  $('.datahead').empty();

  var newloc = window.location.hash;

  if (newloc == '#/sub') {
    window.location = '#/all';
  }

  if (newloc == '#/all') {
    window.location = '#/main';
  }

  if (newloc == '#/data') {
    window.location = '#/sub';
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

  if (newloc == '#/all') {
    $('.subhead').empty();
    $('.subcontent').empty();
    $('.datacontent').empty();
    $('.datahead').empty();

  }

  if (newloc == '#/sub') {
    $('.content').empty();
    $('.uncontent').empty();
    $('.datacontent').empty();
    $('.datahead').empty();

  }

  if (newloc == '#/data') {
    $('.content').empty();
    $('.uncontent').empty();
    $('.subhead').empty();
    $('.subcontent').empty();
  }

});
