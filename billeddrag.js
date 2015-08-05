 var word_Array = []; //"Affectionate", "Sensitive", "Condescending", "Confident", "Resolute", "Obstinate", "Submissive", "Courageous", "Extrovert", "Talkative", "Reticent", "Introvert", "Prudent", "Sensible", "Illogical", "Perplexed", "Puzzled", "Devastated", "Distressed", "Enraged", "Infuriated", "Thrilled"];
 var transArray = []; //["Kærlig", "Sensitiv", "Nedladende", "Confident", "Resolute", "Stædig", "Underkastet", "Modig", "Udadvendt", "Snakkesalig", "Tilbageholdende", "Indadvendt", "Forsigtig", "Fornuftig", "Ulogisk", "Perpleks", "Forvirret", "Ødelagt", "Fortvivlet", "Vred", "Rasende", "Begejstret"];
 var correct_Array = []; //["0", "1", "0", "1", "0", "1", "0", "1", "0", "1", "0", "1", "0", "1", "0", "1", "0", "1", "0", "1", "1", "1"];
 var feedback_Array = [];
 var attempts = 0;
 var score = 0;
 var cursorY;
 var cursorX;

 var antal_korrekte = 0;

 function loadData(url) {
     $.ajax({
         url: url,
         // contentType: "application/json; charset=utf-8",  // Blot en test af tegnsaettet....
         //dataType: 'json', // <------ VIGTIGT: Saadan boer en angivelse til en JSON-fil vaere! 
         dataType: 'text', // <------ VIGTIGT: Pga. ???, saa bliver vi noedt til at angive JSON som text. 
         async: false, // <------ VIGTIGT: Sikring af at JSON hentes i den rigtige raekkefoelge (ikke asynkront). 
         success: function(data, textStatus, jqXHR) {


             JsonObj = jQuery.parseJSON(data);

             // Alt data JsonObj foeres over i arrays:
             for (var Key in JsonObj) {
                 //console.log(JsonObj[Key].English);
                 word_Array.push(JsonObj[Key].English);
                 transArray.push(JsonObj[Key].Dansk);
                 correct_Array.push(JsonObj[Key].Correct);
                 feedback_Array.push(JsonObj[Key].Explanation);

                 if (JsonObj[Key].Correct !== "2") {
                     antal_korrekte++;
                 }
             }

             $(".correct").html("Correct answers: <b>" + score + " / " + antal_korrekte + " </b> Attempts: <b>" + attempts + "</b>");
             init();
         },
         error: function(jqXHR, textStatus, errorThrown) {
             alert("Error!!!\njqXHR:" + jqXHR + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown);
         }
     });
 }

 function init() {

     //test_script();

     for (var i = 0; i < word_Array.length; i++) {
         $(".draggable_container").append("<div class='btn btn-info draggable' id=" + i + ">" + word_Array[i] + "</div>");
     }

     //shuffleDivs($(".draggable_container"));

     $(".draggable_container").randomize(".draggable");

     //console.log(json);
     $(".draggable").draggable({
         revert: true,
         drag: function(event, ui) {
             $(".dialogBox").remove();
             $(this).css("opacity", 0.8).addClass("draggable-active");
         },
         stop: function(event, ui) {
             $(this).css("opacity", 1).removeClass("draggable-active");
         }
     });

     $(".btn_switch").mousedown(switch_words);
     $(".btn_switch").mouseup(reset_switch_words);
     $(".draggable").click(function() {
         explanation($(this));
     });

     $(".part_pic").click(function() {
         $(this).fadeOut(400);
     });

     document.onmousemove = function(e) {
         //alert(e.pageX);
         cursorX = e.pageX;
         cursorY = e.pageY;
     };

     $(".btn_tjek").click(tjeksvar);



     $(".droppable").droppable({
         drop: function(event, ui) {

             if ($(this).attr("value") != "2") {


                 $(this).fadeTo(50, 0.8, function() {
                     $(this).fadeTo(400, 1);
                 });
             }

             ui.draggable.attr("value", $(this).attr("value"));

             //alert($(".droppable").eq(0).html());

             //$(this).css("opacity", 0)


             //ui.draggable.addClass("dropped_" + $(this).index($(".droppable"));

             var myIndex = $(ui.draggable).index();

             $(".draggable").eq(myIndex).draggable({
                 revert: 'invalid'
             });
         }
     });
 }



 function tjeksvar() {
     $(".dialogBox").remove();
     var score = 0;
     attempts++;
     $(".draggable").each(function() {
         var indeks = $(this).attr("id");
         console.log(indeks + "," + $(this).attr("value"));
         if ($(this).attr("value") == correct_Array[indeks] && $(this).attr("value") != "2") {
             $(this).addClass("btn-success").removeClass("btn-info");
             console.log("correct!");
             score++;
         } else {
             $(this).addClass("btn-info").removeClass("btn-success");
             $(this).animate({
                 top: 0,
                 left: 0
             }, 500, function() {
                 $(this).attr("value", "2");
             });
             //$(this).animate.css("top", "0px").css("left", "0px");
         }

     });
     $(".correct").html("Correct answers: <b>" + score + " / " + antal_korrekte + " </b> Attempts: <b>" + attempts + "</b>");
 }

 function switch_words() {
     $(".draggable").each(function() {
         if ($(this).attr("value") != "0" && $(this).attr("value") !== "1") {
             var indeks = $(this).attr("id");
             var pos = $(this).index();
             //$(".btn_switch").mousedown(switch_words);
             //$(".btn_switch").unbind(reset_switch_words);
             $(this).fadeOut(pos * 10, function() {
                 $(this).html(transArray[indeks]);
                 $(this).fadeIn(pos * 30);

                 $(this).addClass("btn-primary").removeClass("btn-info");
             });
         }
     });
 }

function reset_switch_words() {
    $(".btn_switch").unbind();     
     setTimeout(function(){
         $(".draggable").each(function() {
             if ($(this).attr("value") != "0" && $(this).attr("value") !== "1") {
                 var indeks = $(this).attr("id");
                 var pos = $(this).index();
                 $(this).fadeOut((word_Array.length - pos) * 10, function() {
                     $(this).fadeIn((word_Array.length - pos) * 20);
                     
                 $(this).addClass("btn-info").removeClass("btn-primary");
                 $(this).html(word_Array[indeks]);
                 });
             }
         });
         $(".btn_switch").mousedown(switch_words);
         $(".btn_switch").mouseup(reset_switch_words);
     }, 1000);
 }

 function explanation(dims) {
     var indeks = dims.attr("id");

     //console.log(correct_Array[indeks]);
     console.log("indeks: " + indeks + ", dims-value: " + dims.attr("value") + " , correct_Array[indeks]" + correct_Array[indeks]);
     if (dims.attr("value") && dims.attr("value") != "2") {
         if (dims.attr("value") == correct_Array[indeks]) {
             dialogBox("Correct:" + feedback_Array[indeks]);
         } else {
             if (correct_Array[indeks] != "2") {
                 dialogBox("Incorrect: " + word_Array[indeks] + " is not a word that describes this character..");
             } else {
                 dialogBox("Incorrect: " + feedback_Array[indeks]);
             }

         }


         //tjeksvar();
     }
 }

 function dialogBox(body) {

     $("body").append("<div class='dialogBox'>" + body + "</div>");
     $(".dialogBox").css("top", (cursorY + 20) + "px").css("left", cursorX - 125).css("opacity", 0.1).fadeTo(400, 1);


     $(".dialogBox").click(function() {
         $(".dialogBox").remove();
     });

 }

 $.fn.randomize = function(childElem) {

     return this.each(function() {
         //console.log(this)
         var $this = $(this);
         var elems = $this.children(childElem);

         elems.sort(function() {
             return (Math.round(Math.random()) - 0.5);
         });
         console.log(elems);

         $this.remove(childElem);

         for (var i = 0; i < elems.length; i++)
             $this.append(elems[i]);

     });
 };
