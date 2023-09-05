//MODUL PROGRAMTERVEZÉSI MINTA ALAPJÁN

let koltsegvetesVezerlo = (function () {
  //privát rész

  class kiadas {
    constructor(id, leiras, ertek) {
      this.id = id;
      this.leiras = leiras;
      this.ertek = ertek;
      this.szazalek = -1;
    }

    szazalekSzamitas(osszBevetel) {
      if (osszBevetel > 0) {
        this.szazalek = Math.round((this.ertek / osszBevetel) * 100);
      } else {
        this.szazalek = -1;
      }
    }

    getSzazalek() {
      return this.szazalek;
    }
  }

  let vegosszegSzamolas = function (tipus) {
    let osszeg = 0;

    adatok.tetelek[tipus].forEach((akt) => {
      osszeg += akt.ertek;
    });

    adatok.osszegek[tipus] = osszeg;
  };

  let adatok = {
    tetelek: {
      bev: [],
      kia: [],
    },

    osszegek: {
      bev: 0,
      kia: 0,
    },

    koltsegvetes: 0,
    szazalek: -1,
  };

  return {
    tetelHozzaad: function (obj) {
      let bevList = JSON.parse(localStorage.getItem("bev")) || [];
      let kiaList = JSON.parse(localStorage.getItem("kia")) || [];

      if (obj.tipus === "bev") {
        bevList.push(obj);
        localStorage.setItem("bev", JSON.stringify(bevList));
      } else if (obj.tipus === "kia") {
        kiaList.push(obj);
        localStorage.setItem("kia", JSON.stringify(kiaList));
      }
    },

    tetelTorol: function (tipus, id) {
      //map egy teljesen új tömbbel tér vissza
      let idTomb, index;

      idTomb = adatok.tetelek[tipus].map(function (aktualis) {
        return aktualis.id;
      });

      index = idTomb.indexOf(id);

      if (index !== -1) {
        adatok.tetelek[tipus].splice(index, 1);
      }
    },

    koltsegvetesSzamolas: function () {
      //összbevétel-összkiadás számolása
      vegosszegSzamolas("bev");
      vegosszegSzamolas("kia");

      //költségvetés kiszámolása
      adatok.koltsegvetes = adatok.osszegek.bev - adatok.osszegek.kia;

      //százalék számolása

      if (adatok.osszegek.bev > 0) {
        adatok.szazalek = Math.round(
          (adatok.osszegek.kia / adatok.osszegek.bev) * 100
        );
      } else {
        adatok.szazalek = -1;
      }
    },

    getKoltsegvetes: function () {
      return {
        koltsegvetes: adatok.koltsegvetes,
        osszBevetel: adatok.osszegek.bev,
        osszKiadas: adatok.osszegek.kia,
        szazalek: adatok.szazalek,
      };
    },

    szazalekokSzamolasa: function () {
      adatok.tetelek.kia.forEach(function (aktualisElem) {
        aktualisElem.szazalekSzamitas(adatok.osszegek.bev);
      });
    },

    szazalekokLekerdezese: function () {
      let kiadasSzazalekok = adatok.tetelek.kia.map(function (aktualisElem) {
        return aktualisElem.getSzazalek();
      });

      return kiadasSzazalekok;
    },
  };
})();

let feluletVezerlo = (function () {
  //privát rész
  let DOMelemek = {
    inputTipus: ".hozzaad__tipus",
    inputLeiras: ".hozzaad__leiras",
    inputErtek: ".hozzaad__ertek",
    inputGomb: ".hozzaad__gomb",
    bevetelTarolo: ".bevetelek__lista",
    kiadasTarolo: ".kiadasok__lista",
    koltsegvetesCimke: ".koltsegvetes__ertek",
    osszbevetelCimke: ".koltsegvetes__bevetelek--ertek",
    osszkiadasCimke: ".koltsegvetes__kiadasok--ertek",
    szazalekCimke: ".koltsegvetes__kiadasok--szazalek",
    kontener: ".kontener",
    szazalekokCimke: ".tetel__szazalek",
    datumCimke: ".koltsegvetes__cim--honap",
  };

  let szamFormazo = function (szam, tipus) {
    let elojel;

    szam = Math.abs(szam);

    szam = szam.toLocaleString();

    tipus === "kia" ? (elojel = "-") : (elojel = "");

    szam = elojel + " " + szam;

    return szam;
  };

  let nodeListForEach = function (lista, callback) {
    for (let i = 0; i < lista.length; i++) {
      callback(lista[i], i);
    }
  };

  //publikus rész
  return {
    getInput: function () {
      //egy objektumot adunk vissza ami tartalmazza a 3 értéket, kiolvassa a megadott 3 értéket
      return {
        tipus: document.querySelector(DOMelemek.inputTipus).value,
        leiras: document.querySelector(DOMelemek.inputLeiras).value,
        ertek: parseInt(document.querySelector(DOMelemek.inputErtek).value),
      };
    },

    getDOMelemek: function () {
      return DOMelemek;
    },

    tetelMegjelenites: function () {
      const bev = JSON.parse(localStorage.getItem("bev")) || [];
      const kia = JSON.parse(localStorage.getItem("kia")) || [];

      let bevhtml, kiahtml;
      let bevelem = DOMelemek.bevetelTarolo;
      let kiaelem = DOMelemek.kiadasTarolo;

      document.querySelector(bevelem).innerHTML = "";
      document.querySelector(kiaelem).innerHTML = "";

      bev.map((item) => {
        bevhtml = `  <div class="tetel clearfix" id="bev-${
          item.id
        }"><div class="tetel__leiras">${
          item.leiras
        }</div><div class="right clearfix"><div class="tetel__ertek">${szamFormazo(
          item.ertek,
          item.tipus
        )} Ft</div><div class="tetel__torol"><button class="tetel__torol--gomb"><i class="ion-ios-close-outline"></i></button></div></div></div>`;

        document
          .querySelector(bevelem)
          .insertAdjacentHTML("beforeend", bevhtml);
      });

      kia.map((obj) => {
        kiahtml = `<div class="tetel clearfix" id="kia-${
          obj.id
        }"><div class="tetel__leiras">${
          obj.leiras
        }</div><div class="right clearfix"><div class="tetel__ertek">${szamFormazo(
          obj.ertek,
          obj.tipus
        )} Ft</div><div class="tetel__szazalek">21%</div><div class="tetel__torol"><button class="tetel__torol--gomb"><i class="ion-ios-close-outline"></i></button></div></div></div>`;

        document
          .querySelector(kiaelem)
          .insertAdjacentHTML("beforeend", kiahtml);
      });
    },

    tetelTorles: function (tetelID) {
      let elem = document.getElementById(tetelID);
      elem.parentNode.removeChild(elem);
    },

    urlapTorles: function () {
      let mezok = document.querySelectorAll(
        DOMelemek.inputLeiras + "," + DOMelemek.inputErtek
      );

      //nodelistát ad vissza a queryselectorAll, ezért ezt a listát tömbbé kell alakítani

      let mezokTomb = Array.prototype.slice.call(mezok);

      mezokTomb.forEach(function (currentValue, index, array) {
        currentValue.value = "";
      });

      mezokTomb[0].focus();
    },

    koltsegvetesMegjelenites: function (obj) {
      let tipus;

      obj.koltsegVetes > 0 ? (tipus = "bev") : "kia";

      document.querySelector(
        DOMelemek.koltsegvetesCimke
      ).textContent = `${szamFormazo(obj.koltsegvetes, tipus)} Ft`;
      document.querySelector(
        DOMelemek.osszbevetelCimke
      ).textContent = `${szamFormazo(obj.osszBevetel, "bev")} Ft`;
      document.querySelector(
        DOMelemek.osszkiadasCimke
      ).textContent = `${szamFormazo(obj.osszKiadas, "kia")} Ft`;

      if (obj.szazalek > 0) {
        document.querySelector(DOMelemek.szazalekCimke).textContent =
          obj.szazalek + "%";
      } else {
        document.querySelector(DOMelemek.szazalekCimke).textContent = "-";
      }
    },

    szazalekokMegjelenitese: function (szazalekok) {
      let elemek = document.querySelectorAll(DOMelemek.szazalekokCimke);

      nodeListForEach(elemek, function (aktualisElem, index) {
        if (szazalekok[index] > 0) {
          aktualisElem.textContent = szazalekok[index] + "%";
        } else {
          aktualisElem.textContent = "---";
        }
      });
    },

    datumMegjelenites: function () {
      let most, ev, honap, honapok, nap;

      honapok = [
        "Január",
        "Február",
        "Március",
        "Április",
        "Május",
        "Június",
        "Július",
        "Augusztus",
        "Szeptember",
        "Október",
        "November",
        "December",
      ];
      most = new Date();
      ev = most.getFullYear();
      honap = most.getMonth();
      nap = most.getDate();

      document.querySelector(DOMelemek.datumCimke).textContent = `${ev}. ${
        honapok[honap]
      } ${String(nap).padStart(2, "0")}.`;
    },

    tetelTipusValtozas: function () {
      let elemek = document.querySelectorAll(
        DOMelemek.inputTipus +
          "," +
          DOMelemek.inputLeiras +
          "," +
          DOMelemek.inputErtek
      );

      nodeListForEach(elemek, function (aktualisElem) {
        aktualisElem.classList.toggle("red-focus");
      });

      document.querySelector(DOMelemek.inputGomb).classList.toggle("red");
    },
  };
})();

let vezerlo = (function (koltsegvetesVez, feluletVez) {
  //privát rész
  let esemenykezeloBeallit = function () {
    let DOM = feluletVezerlo.getDOMelemek();

    document
      .querySelector(DOM.inputGomb)
      .addEventListener("click", VezTetelHozzaadas);

    //enter gomb megnyomására is működjön a vezérlő
    //keycode és a which deprecated
    document.addEventListener("keydown", function (event) {
      if (event.key !== undefined && event.key === "Enter") {
        VezTetelHozzaadas();
      } else if (event.keyCode !== undefined && event.keyCode === 13) {
        VezTetelHozzaadas();
      }
    });

    document
      .querySelector(DOM.kontener)
      .addEventListener("click", vezTetelTorles);

    document
      .querySelector(DOM.inputTipus)
      .addEventListener("change", feluletVezerlo.tetelTipusValtozas);
  };

  let osszegFrissitese = function () {
    koltsegvetesVezerlo.koltsegvetesSzamolas();

    let koltsegVetes = koltsegvetesVezerlo.getKoltsegvetes();

    feluletVezerlo.koltsegvetesMegjelenites(koltsegVetes);
  };

  let szazalekokFrissitese = function () {
    //1.százalékok újraszámolása
    koltsegvetesVezerlo.szazalekokSzamolasa();

    //2.százalékok kiolvasása a költségvetésvezérlőből
    let kiadasSzazalekok = koltsegvetesVezerlo.szazalekokLekerdezese();

    //3.UI frissítése az új százalékokkal

    feluletVezerlo.szazalekokMegjelenitese(kiadasSzazalekok);
  };

  let VezTetelHozzaadas = function () {
    let input, ujTetel;

    //1. bevitt adatok megszerzése a felületről
    input = feluletVezerlo.getInput();

    if (input.leiras !== "" && !isNaN(input.ertek) && input.ertek > 0) {
      ujTetel = {
        id: new Date().getTime(),
        tipus: input.tipus,
        leiras: input.leiras,
        ertek: input.ertek,
      };
      //2. az adatok átadása a költségvetésvezérlő modulnak
      koltsegvetesVezerlo.tetelHozzaad(ujTetel);

      //3.a bevitt tételek megjelenítése az UI-n
      feluletVezerlo.tetelMegjelenites();

      //4.beviteli mezők törlése
      feluletVezerlo.urlapTorles();

      //5.költségvetés újraszámolása és frissítése a felületen
      osszegFrissitese();

      //6.százalékok újraszámolása és frissítése a felületen
      szazalekokFrissitese();
    }
  };

  let vezTetelTorles = function (event) {
    let tetelID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    let splitID, tipus, ID;

    if (tetelID) {
      //bev-0
      splitID = tetelID.split("-");
      tipus = splitID[0];
      ID = parseInt(splitID[1]);
    }

    //1.tétel törlése az adatok objektumból és az UI-ról is
    koltsegvetesVezerlo.tetelTorol(tipus, ID);

    feluletVezerlo.tetelTorles(tetelID);

    //2.összeget újraszámolása és megjelenítése az UI-n
    osszegFrissitese();

    //3.százalékok újraszámolása és frissítése a felületen
    szazalekokFrissitese();
  };

  return {
    init: function () {
      console.log("Az alkalmazás elindult");

      feluletVezerlo.datumMegjelenites();
      feluletVezerlo.tetelMegjelenites();
      feluletVezerlo.koltsegvetesMegjelenites({
        koltsegvetes: 0,
        osszBevetel: 0,
        osszKiadas: 0,
        szazalek: -1,
      });
      esemenykezeloBeallit();
    },
  };
})(koltsegvetesVezerlo, feluletVezerlo);

vezerlo.init();
