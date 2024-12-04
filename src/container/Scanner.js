$(document).ready(function(){
  
    $("input.ean").on("change", function(){
      //addProduct();
          });
      function addProduct(){
        var eancode = $("input.ean").val();
        $.getJSON("https://world.openfoodfacts.org/api/v0/product/" + eancode + ".json", function(data){
            if(data.status){        
                var product_name = data.product.product_name;
                var product_kcal = data.product.nutriments["energy-kcal"];
                $("tr.hide td:eq(3)").html(product_name);
                $("tr.hide td:eq(4)").html(product_kcal + " kcal");
            }
        });
        $("tr.hide td:eq(0)").text($('tbody tr').length);
          $("tr.hide td:eq(1)").text(eancode);
          $("tr.hide td:eq(2)").html("Product " + ($('tbody tr').length));
          $("tr.hide td:eq(3)").text("1.00").addClass("text-right");
          $(".total_price").text("1.00");
          $(".total_kcal").text("0.00");
          $("tr.hide td:eq(4)").text("0.00");
            calc_total();
            
          $('.table-add').click();
          
          setTimeout(function(){getProductNames();}, 1000);
         // $("button.button.scan").on("click", function(){App.activateScanner();});
      }
      $(".add_product").on("click", function(){
          addProduct();
        });
  
        function getProductNames(){
          var sum = 0;
          $("tbody tr").each(function(i){
              var barcode = $("tbody > tr:nth-child(" + (i+1) + ") > td:nth-child(2)").text();
              console.log(barcode);
              if(barcode){
              $.getJSON("https://world.openfoodfacts.org/api/v0/product/" + barcode + ".json", function(data){
              if(data.status){ 
                console.log(data.product.product_name);       
                var product_name = data.product.product_name;
                var product_kcal = data.product.nutriments["energy-kcal"];
                //$("tbody > tr:nth-child(" + i + ") > td:nth-child(3)").text(product_name);
                $("tbody > tr:nth-child(" + (i +1 ) + ") > td:nth-child(3)").text(product_name);
                $("tbody > tr:nth-child(" + (i +1 ) + ") > td:nth-child(5)").text(product_kcal + " kcal");
                calc_total();
              }
            });
          }
          });
       }
  
        function calc_total(){
          var sum = 0, sum_kcal = 0;
          $("tbody tr").each(function(i){
            $("td:eq(0)",this).text(((i)));
          });
          $("tr:not(.hide) .price").each(function(){
          sum += parseFloat($(this).text());
          //console.log($(this).text());
        });
        $('.total_price').text((sum).toFixed(2));
        $("tr:not(.hide) .kcal").each(function(){
          sum_kcal += parseFloat($(this).text());
          //console.log($(this).text());
        });
  
        $('.total_kcal').text((sum_kcal).toFixed(2));
      }
  
      $(".overlay__close").on("click", function(){
        $(".overlay").hide();
      });
    // TABLE SCRIPT ----------------------------------
       var $TABLE = $('#table');
  var $BTN = $('#export-btn');
  var $EXPORT = $('#export');
  
  $('.table-add').click(function() {
    var $clone = $('#table').find('tr.hide').clone(true).removeClass('hide table-line');
    $('#table').find('tbody').append($clone);
    calc_total();
  });
  
  $('.table-remove').click(function() {
    $(this).parents('tr').remove();
    calc_total();
  }); 
  
  $('.table-up').click(function() {
    var $row = $(this).parents('tr');
    if ($row.index() === 1) return; // Don't go above the header
    $row.prev().before($row.get(0));
  });
  
  $('.table-down').click(function() {
    var $row = $(this).parents('tr');
    $row.next().after($row.get(0));
  });
  
  // A few jQuery helpers for exporting only
  jQuery.fn.pop = [].pop;
  jQuery.fn.shift = [].shift;
  
  $BTN.click(function() {
    var $rows = $TABLE.find('tr:not(:hidden)');
    var headers = [];
    var data = [];
  
    // Get the headers (add special header logic here)
    $($rows.shift()).find('th:not(:empty):not([data-attr-ignore])').each(function() {
      headers.push($(this).text().toLowerCase());
    });
  
    // Turn all existing rows into a loopable array
    $rows.each(function() {
      var $td = $(this).find('td');
      var h = {};
  
      // Use the headers from earlier to name our hash keys
      headers.forEach(function(header, i) {
        h[header] = $td.eq(i).text(); // will adapt for inputs if text is empty
      });
  
      data.push(h);
    });
  
    // Output the result
    $EXPORT.text(JSON.stringify(data));
  });
        //});
    
     var Quagga = window.Quagga;
  var App = {
      _scanner: null,
      init: function() {
          this.attachListeners();
      },
      activateScanner: function() {
          var scanner = this.configureScanner('.overlay__content'),
              onDetected = function (result) {
                  document.querySelector('input.ean').value = result.codeResult.code;
                  addProduct();
                  stop();
              }.bind(this),
              stop = function() {
                  scanner.stop();  // should also clear all event-listeners?
                  scanner.removeEventListener('detected', onDetected);
                  this.hideOverlay();
                  $(".overlay").hide();
                  //$(".overlay__close").trigger("click");
                  this.attachListeners();
                  
              }.bind(this);
  
          this.showOverlay(stop);
          scanner.addEventListener('detected', onDetected).start();
      },
      attachListeners: function() {
          var self = this,
              button = document.querySelector('.input-field button.scan');
  
          button.addEventListener("click", function onClick(e) {
              e.preventDefault();
              button.removeEventListener("click", onClick);
              self.activateScanner();
          });
      },
      showOverlay: function(cancelCb) {
          if (!this._overlay) {
              var content = document.createElement('div'),
                  closeButton = document.createElement('div');
                  closeButton.innerHTML = '<button type="button" class="btn btn-danger button close-overlay text-white bg-dark">Close</button>';
              //closeButton.appendChild(document.createTextNode('[ X ]'));
              //closeButton.appendChild();
  
              content.className = 'overlay__content';
              closeButton.className = 'overlay__close';
              this._overlay = document.createElement('div');
              this._overlay.className = 'overlay';
              this._overlay.appendChild(content);
              content.appendChild(closeButton);
              closeButton.addEventListener('click', function closeClick() {
                  closeButton.removeEventListener('click', closeClick);
                  cancelCb();
              });
              document.body.appendChild(this._overlay);
          }
          else if (!$(".overlay__content").html()){
            var content = document.createElement('div'),
            closeButton = document.createElement('div');
            closeButton.innerHTML = '<button type="button" class="btn btn-danger button close-overlay text-white bg-dark">Close</button>';
            //closeButton.appendChild(document.createTextNode('[ X ]'));
            content.className = 'overlay__content';
            closeButton.className = 'overlay__close';
            this._overlay.appendChild(content);
            content.appendChild(closeButton);
            closeButton.addEventListener('click', function closeClick() {
                closeButton.removeEventListener('click', closeClick);
                cancelCb();
            });
            document.body.appendChild(this._overlay);
          }
          else {
              this._overlay.style.display = "block";
              var closeButton = document.querySelector('.overlay__close');
              closeButton.addEventListener('click', function closeClick() {
                  closeButton.removeEventListener('click', closeClick);
                  cancelCb();
              });
          }
          this._overlay.style.display = "block";
          $(".overlay").show();
      },
      hideOverlay: function() {
          if (this._overlay) {
              this._overlay.style.display = "none";
              $(".overlay").html("");
              $(".overlay").hide();
              //scanner.stop();
              //$(".overlay__close").click();
          }
          else {
            closeClick();
            //$(".overlay__content").hide();
          }
      },
      configureScanner: function(selector) {
          if (!this._scanner) {
              this._scanner = Quagga
                  .decoder({readers: ['ean_reader']})
                  .locator({patchSize: 'medium'})
                  .fromSource({
                      target: selector,
                      constraints: {
                          width: 800,
                          height: 600,
                          facingMode: "environment"
                      }
                  });
          }
          return this._scanner;
      }
  };
  
  App.init();
  /*
  var resultCollector = Quagga.ResultCollector.create({
      capture: true, // keep track of the image producing this result
      capacity: 20,  // maximum number of results to store
      blacklist: [   // list containing codes which should not be recorded
      //    {code: "3574660239843", format: "ean_13"}
      ],
      filter: function(codeResult) {
          // only store results which match this constraint
          // returns true/false
          // e.g.: return codeResult.format === "ean_13";
          return true;
      }
  });
  
  Quagga.registerResultCollector(resultCollector);
  */
  
  });