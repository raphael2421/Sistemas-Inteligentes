/*
AUTOR : Sergio LUNA, Rafa
ESTAS FUNCIONES HACEN ALGO
FECHA:4 JULIO 2019
*/

'use strict';
const {
  dialogflow,
  BasicCard,
  BrowseCarousel,
  BrowseCarouselItem,
  Button,
  Carousel,
  Image,
  LinkOutSuggestion,
  List,
  MediaObject,
  Suggestions,
  SimpleResponse,
  Table,
 } = require('actions-on-google');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

let a;

var serviceAccount = require('./firestoreKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

const app = dialogflow({debug: true});

const dialogflowapi = require('dialogflow');



//INTENT DE PREGUNTAS


app.intent('Preguntas', (conv)=> {

  var  topic= conv.parameters["topic"];
  var  tema= conv.parameters["any"];


/*
  var referencia = db.collection("Materias");
  var queryRef = referencia.where('nombre', '==', 'greedy');
   var getDoc = queryRef.get().then(doc => {
    if (doc.empty) {
       return console.log('Documento no encontrado');
    }
      doc.forEach(doc2 => {
        console.log(doc2.id, '=>', doc2.data());
      });
      return console.log("terminado");
    }
  )
  .catch(err => {
    return console.log('Error getting document', err);
  });
*/

  var tipo="Algoritmos";
  var sfRef=db.collection("Materias")
  .where('Sinonimos', 'array-contains', topic.toUpperCase() );

  var getDoc = sfRef.get().then(doc => {
   if (doc.empty) {
      return console.log('Documento no encontrado');

   }
     doc.forEach(doc2 => {
       console.log(doc2.id, '=>', doc2.data().Nombre);
       tipo=doc2.data().Nombre;
     });
     return console.log("terminado");
   }
 )
 .catch(err => {
   return console.log('Error getting document', err);

 });


 //Segunda referencia

let conceptos=[];

 var concepto="Hola";
 var sfRef2=db.collection(tipo)
 .where('nombre', 'array-contains', tema.toUpperCase() );

return sfRef2.get().then(doc => {
  if (doc.empty) {
    console.log('Documento no encontrado');
  }
    doc.forEach(doc2 => {
      var concepto={};
      a=concepto.Concepto=doc2.data().Concepto;
      conceptos.push(concepto);
    });



    conv.ask(new SimpleResponse({
    speech:"La definición es la siguiente     \n"+ a +"Esto puedo hacer",
        text:"El nombre del tópico es " + a + "😬",
    }));


    //IMPRIME CARRUSEL CON LOS DATOS ENCONTRADOS EN LOS NODOVideo
    conv.ask(new Carousel({
    items: {
      Video: {
        title: 'Video',
        description: 'Muestra Videos sobre el algoritmo',
        synonyms: ['Video'],
        image: new Image({
    url: 'https://png.pngtree.com/element_origin_min_pic/17/07/28/e317092bb55fcce10fb6f38f3321defa.jpg',
    alt: 'Video',
    }),
      },
      Examen: {
        title: 'Examen',
        description: 'Realiza un diagnostico sobre el tema',
        synonyms: [ 'Examen'],
        image: new Image({
    url: 'http://www.soycest.mx/blog/wp-content/uploads/2018/08/CEST_13-consejos-para-que-apruebes-el-examen-de-admision-para-universidad.jpg',
    alt: 'Examen',
    }),
      }
    }
    }));

    return console.log("done");
  }
)
.catch(err => {
   return console.log('Error getting document', err);
});

//CIERRE DEL INTENT
});



//INTENT DE PREGUNTAS VIDEOS//

app.intent('Preguntas-videos', conv => {


  const context = conv.contexts.get('preguntas-followup');
  const nombre= context.parameters.topic;
  const tema =context.parameters.any;
  conv.ask(new SimpleResponse({
  speech:"Muy bien! tengo los siguientes videos sobre "+ tema +", espero y te agraden",
      text:"Mira!"+"😬",
  }));


  var sfRef2=db.collection("Algoritmos")
  .where('nombre', 'array-contains', tema.toUpperCase());
let arreglo=[];
 return sfRef2.get().then(doc => {
   if (doc.empty) {
     console.log('Documento no encontrado');
   }
     doc.forEach(doc2 => {
       var concepto={};
       concepto=doc2.data();
       arreglo.push(concepto);
     });



     var video_id = arreglo[0].videos[0].split('v=')[1];
     var ampersandPosition = video_id.indexOf('&');
     if(ampersandPosition !== -1) {
       video_id = video_id.substring(0, ampersandPosition);
     }


     var video_id2 = arreglo[0].videos[1].split('v=')[1];
     var ampersandPosition2 = video_id2.indexOf('&');
     if(ampersandPosition2 !== -1) {
       video_id2 = video_id2.substring(0, ampersandPosition2);
     }


     var videos=[];


     arreglo[0].videos.forEach(vid=>{
       var video_id = vid.split('v=')[1];
       var ampersandPosition = video_id.indexOf('&');
       if(ampersandPosition !== -1) 
          video_id = video_id.substring(0, ampersandPosition);
       videos.push(video_id)
     })
     console.log('videos contiene '+ videos);
     



     var items = [];
arreglo[0].videos.forEach((result, index) => {
    console.log(`Building item from result: ${result}`);
items.push(
          new BrowseCarouselItem({
      title: 'Video '+(index+1),
      url: result,
      description: 'Video 1',
      image: new Image({
        url: 'https://img.youtube.com/vi/'+videos[index]+'/maxresdefault.jpg',
        alt: 'Image alternate text',
      }),
      footer: 'Video 1',
    })
     )
  });

  console.log(items);




 conv.ask(new BrowseCarousel({
  items:items,
}));




return   console.log('done');

   }).catch(err => {
      return console.log('Error getting document', err);
   });




/*
  conv.ask(new BasicCard({
  text: `ESTE ES UN PRIMER VIDEO SOBRE GREDDY`, // Note the two spaces before '\n' required for
                               // a line break to be rendered in the card.
  subtitle: 'GREDDY',
  title: 'ALGORITMO DE GREEDY',
  buttons: new Button({
    title: 'ABRE VIDEO',
    url: 'https://www.youtube.com/watch?v=DsS33DCWvC4',
  }),
  image: new Image({
    url: 'https://img.youtube.com/vi/DsS33DCWvC4/0.jpg',
    alt: 'VIDEO',
  }),
  display: 'VIDEO GREDDY',
}));
conv.ask(new BasicCard({
text: `ESTE ES UN PRIMER VIDEO SOBRE GREDDY`, // Note the two spaces before '\n' required for
                             // a line break to be rendered in the card.
subtitle: 'GREDDY',
title: 'ALGORITMO DE GREEDY',
buttons: new Button({
  title: 'ABRE VIDEO',
  url: 'https://www.youtube.com/watch?v=DsS33DCWvC4',
}),
image: new Image({
  url: 'https://img.youtube.com/vi/DsS33DCWvC4/0.jpg',
  alt: 'VIDEO',
}),
display: 'VIDEO GREDDY',
}));
*/

});


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);