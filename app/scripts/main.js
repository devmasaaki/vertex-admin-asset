var API_HOST = 'http://192.168.0.124:3001';
var asset_id = 1;
var categories = [];
var unassigned_subcategories = [];
var unassigned_items = [];
var yao = new Yao.YaoApi();
var step = 0;
var drag = false;
var dialog_effect = { modal: true, show: {effect: 'fade', duration: 500}, hide:{effect: 'explode', duration: 500}};
$('body' ).data('asset_id', 1);

$('document').ready(function() {
  function main() {
    $('.back-icon').hide();
    $('.search-icon').hide();
    $('.refresh-icon').hide();
    $('.overlay').delay(500).fadeOut('slow', function() {});
  };

  function all() {
    clearAll();
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
        var inner_html = '<div class="dragit col-xs-12">' +
            '<div class="col-xs-6 no-pad assigned" type="category" assigned="true" data-index="' + i + '" onclick="subnav(' + i + ')">' +
              '<img class="folder-icon" src="images/folder.png">' + categories[i].name +
            '</div>' +
            '<div class="col-xs-4">' + categories[i].createdAt + '</div>' +
            '<div class="col-xs-2">' + size + ' Files</div>' +
            '<img class="edit-icon" assigned="true" data-index="' + i + '" src="images/edit.png">' +
          '</div>';

        $('.content').append(inner_html);
      }
    }

    //unassigned subcategories
    for (i = 0; i < unassigned_subcategories.length; i++){
      var size = unassigned_subcategories[i].items.length;
      var inner_html = '<div class="dragit col-xs-12">' +
          '<div class="col-xs-6 no-pad" type="sub" assigned="false" data-index="' + i + '">' +
            '<img class="folder-icon" src="images/folder.png">' + unassigned_subcategories[i].name +
          '</div>' +
          '<div class="col-xs-4">' + unassigned_subcategories[i].createdAt + '</div>' +
          '<div class="col-xs-2">' + size + ' Files</div>' +
          '<img class="edit-icon" assigned="false" type="sub" data-index="' + i + '" src="images/edit.png">' +
        '</div>';

      $('.uncontent').append(inner_html);
    }

    //unassigned items
    for (i = 0; i < unassigned_items.length; i++){
      // size = unassigned_items[i].filesize
      var size  = '2M';
      var inner_html = '<div class="dragit col-xs-12">' +
          '<div class="col-xs-6 no-pad" type="item" assigned="false" data-index="' + i + '">' +
            '<img class="folder-icon" src="images/pdficon.png">' + unassigned_items[i].title +
          '</div>' +
          '<div class="col-xs-4">' + unassigned_items[i].createdAt + '</div>' +
          '<div class="col-xs-2">' + size + ' </div>' +
          '<img class="edit-icon edit-item" assigned="false" type="item" data-index="' + i + '" src="images/edit.png">' +
        '</div>';

      $('.uncontent').append(inner_html);
    }

    $('.edit-icon').click(function() {
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
          data: item
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
          data: item
        };
        same = false;
        dragAll(source, target, all);
      }
    });

    $('body').droppable({
      drop: function() {
        if (same) {
          refreshAll(all);
        }
        same = true;
      }
    });
  };

  function sub() {
    step = 1;
    var getcat = $( 'body' ).data();
    var category_index = getcat.category_index;
    var category = categories[category_index];
    $('.subhead').append(category.name);

    for (i = 0; i < category.subcategories.length; i++) {
      var size = 0;
      for (k = 0; k < category.subcategories[i].items.length; k++) {
        if (category.subcategories[i].items[k].deleted == false) {
          size++;
        }
      }
      if (category.subcategories[i].deleted == false) {
        var inner_html = '<div class="dragit col-xs-12">' +
            '<div class="col-xs-6 no-pad" type="sub" data-index="' + i + '" onclick="datanav(' + i + ')">' +
              '<img class="folder-icon" src="images/folder.png">' + category.subcategories[i].name +
            '</div>' +
            '<div class="col-xs-4">' + category.subcategories[i].createdAt + '</div>' +
            '<div class="col-xs-2">' + size + ' Files</div>' +
            '<img class="edit-icon edit-sub" data-index="' + i + '" src="images/edit.png">' +
          '</div>';

        $('.subcontent').append(inner_html);
      }
    }

    for (i = 0; i < category.items.length; i++) {
      var size = '2M';
      if (category.items[i].deleted == false) {
        var inner_html = '<div class="dragit col-xs-12">' +
            '<div class="col-xs-6 no-pad" type="item" data-index="' + i + '">' +
              '<a href="' + category.items[i].file.url + '">' +
                '<img class="folder-icon" src="images/pdficon.png">' + category.items[i].title +
              '</a>' +
            '</div>' +
            '<div class="col-xs-4">' + category.items[i].createdAt + '</div>' +
            '<div class="col-xs-2">' + size + ' </div>' +
            '<img class="edit-icon edit-item" data-index="' + i + '" src="images/edit.png">' +
          '</div>';

        $('.subcontent').append(inner_html);
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
      $('body' ).data('sub_index', -1);
      $('body' ).data('item_index', $(this).attr('data-index'));

      var getdata = $('body').data();
      var category_index = getdata.category_index;
      var item_index = getdata.item_index;
      $('#file_name1').val(categories[category_index].items[item_index].title);

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
          data: item
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
          data: item
        };
        same = false;
        dragAll(source, target, sub);
      }
    });

    $('body').droppable({
      drop: function() {
        if (same) {
          refreshAll(sub);
        }
        same = true;
      }
    });
  };

  function data() {
    step = 2;
    var getdata = $( 'body' ).data();
    var category_index = getdata.category_index;
    var sub_index = getdata.sub_index;
    var category = categories[category_index];
    var sub_category = category.subcategories[sub_index];

    $('.datahead').append('<a href="#/sub">' + category.name + '</a> > ' + sub_category.name);

    for (i = 0; i < sub_category.items.length; i++) {
      if (sub_category.items[i].deleted == false) {
        var size = sub_category.items[i].size ? sub_category.items[i].size : '2M';
        var inner_html = '<div class="dragit col-xs-12">' +
            '<div class="col-xs-6 no-pad" data-index="' + i + '">' +
              '<a href="' + sub_category.items[i].file.url + '">' +
                '<img class="folder-icon" src="images/pdficon.png">' + sub_category.items[i].title +
              '</a>' +
            '</div>' +
            '<div class="col-xs-4">' + sub_category.items[i].createdAt + '</div>' +
            '<div class="col-xs-2">' + size + '</div>' +
            '<img class="edit-icon" data-index="' + i + '" src="images/edit.png">' +
          '</div>';

        $('.datacontent').append(inner_html);
      }
    }

    $('.edit-icon').click(function() {
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
          data: item
        };
      }
    });

    $('.no-pad').droppable({
      drop: function() {
        var item = sub_category.items[$(this).attr('data-index')];
        target = {
          assigned: true,
          type: 'item',
          data: item
        };
        same = false;
        dragAll(source, target, data);
      }
    });

    $('body').droppable({
      drop: function() {
        if (same) {
          refreshAll(data);
        }
        same = true;
      }
    });
  };

  function dragAll(source, target, callback) {
    var url = API_HOST + '/api/v1/dragdrop';
    var data = {};

    if (source.type == target.type && source.assigned == target.assigned == true) {
      if (source.type == 'category' && target.type == 'category') {
        url += '/category';
        data = {
          asset_id: asset_id + '',
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
          refreshAll(callback);
        }
      });
    } else if (source.type == 'item' && target.type == 'sub' && source.assigned == target.assigned == true) {
      var dragItem = {
        id: source.data.id,
        category: {
          id: target.data.id,
          type: 'categories'
        }
      }
      yao.updateItem(dragItem).then(function (result) {
        refreshAll(callback);
      }).catch(function (error) {
        alert('Can\'t update Item from API');
        console.log(error);
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
        refreshAll(callback);
      }).catch(function (error) {
        alert('Can\'t update Item from API');
        console.log(error);
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
        refreshAll(callback);
      }).catch(function (error) {
        alert('Can\'t update Item from API');
        console.log(error);
      });
    } else {
      refreshAll(callback);
    }
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
    var category_index = getdata.category_index;
    categories[category_index].name = cat_name;

    var category_id = categories[category_index].id;

    var newCat = {
      id: category_id,
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
    var category_index = getdata.category_index;
    var category_id = categories[category_index].id;

    var delCat = {
      id: category_id,
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
    var getdata = $('body').data();
    var category_index = getdata.category_index;
    var category_id = categories[category_index].id;
    var sub_name = $('#sub_name').val();

    yao.createSubCategory(asset_id, category_id, sub_name).then(function (result) {
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
        refreshAll(sub);
      } else if (step == 0) {
        refreshAll(all);
      }
    }).catch(function (error) {
      alert('Can\'t update subcategory from API');
      console.log(error);
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
        refreshAll(sub);
      } else if (step == 0) {
        refreshAll(all);
      }
    }).catch(function (error) {
      alert('Can\'t delete subcategory from API');
      console.log(error);
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

    if (step == 2) {
      category_id = categories[category_index].subcategories[sub_index].id;
    }
    if (step == 0) {
      $('#assigned').val(false);
    }
    $('#asset_id').val(asset_id);
    $('#category_id').val(category_id);
    var form = new FormData($('#addfile_form')[0]);
    var pdf_title = $('#item_title').val();
    var pdf_file = $('#item_file').val();
    console.log(pdf_title+' '+pdf_file);
    if(pdf_title == ''){
      alert('Please input name');
      return false;
    }
    if(pdf_file == ''){
      alert('Please choose pdf file to upload');
      return false;
    }

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
        if (step == 2) {
          refreshAll(data);
        } else if (step == 1){
          refreshAll(sub);
        } else {
          refreshAll(all);
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
        refreshAll(data);
      } else if (step == 1){
        refreshAll(sub);
      } else {
        refreshAll(all);
      }
    }).catch(function (error) {
      alert('Can\'t update item from API');
      console.log(error);
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
        refreshAll(data);
      } else if (step == 1) {
        refreshAll(sub);
      } else if (step == 0) {
        refreshAll(all);
      }
    }).catch(function (error) {
      alert('Can\'t delete item from API');
      console.log(error);
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

  function refreshAll(callback) {
    yao.assetData(asset_id).then(function (assetData) {
      categories = assetData.categories;
      categories = sortAll(categories);

      yao.getUnassignedSubCategories(asset_id).then(function (data) {
        unassigned_subcategories = data;

        yao.getUnassignedItems(asset_id).then(function (data) {
          unassigned_items = data;
          if (callback) {
            clearAll();
            callback();
            drag = false;
          } else {
            router.configure({
              on: allroutes
            });
            router.init();
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
    window.location = '#/sub';
  }
}

function datanav(intodata) {
  if (!drag) {
    $('body' ).data('sub_index', intodata);
    window.location = '#/data';
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
