// Hidden Gems page logic
(function(){
  function ready(fn){ if(document.readyState==='complete'||document.readyState==='interactive'){ fn(); } else { document.addEventListener('DOMContentLoaded', fn); } }

  ready(function(){
    var sec = document.getElementById('nearby');
    if(!sec) return;
    var WA_BASE = sec.dataset.waBase || '';

    var GEMS = [];
    function fallback(){
      return [
        {id:'lonar', name:'Lonar Crater Lake', lat:19.985, lng:76.507, tags:['nature','photogenic'], where:'Buldhana', teaser:'Meteor-formed emerald lake.'},
        {id:'daulatabad', name:'Daulatabad (Devgiri) Fort', lat:19.943, lng:75.221, tags:['heritage','photogenic'], where:'Near Aurangabad', teaser:'Secret passages, epic views.'},
        {id:'ellora', name:'Ellora: Lesser-known Caves', lat:20.026, lng:75.179, tags:['heritage'], where:'Ellora', teaser:'Quiet caverns beyond Kailasa.'},
        {id:'ajanta', name:'Ajanta Scenic Viewpoints', lat:20.551, lng:75.703, tags:['photogenic','heritage'], where:'Ajanta', teaser:'Forest-framed canyon vistas.'},
        {id:'pitalkhora', name:'Pitalkhora Caves', lat:21.092, lng:74.716, tags:['heritage','nature'], where:'Satpura', teaser:'Monasteries + seasonal falls.'},
        {id:'gautala', name:'Gautala Wildlife Sanctuary', lat:20.423, lng:75.466, tags:['nature'], where:'Kannad', teaser:'Plateau forests, birdlife.'}
      ];
    }

    function km(a,b){
      var toRad=function(d){return d*Math.PI/180;}, R=6371;
      var dLat=toRad(b.lat-a.lat), dLng=toRad(b.lng-a.lng);
      var s=Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2;
      return Math.round(R*2*Math.asin(Math.sqrt(s)));
    }
    function $(s){ return document.querySelector(s); }

    // Map
    var map = L.map('map',{scrollWheelZoom:false}).setView([20.0,75.3], 7);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'\u00A9 OpenStreetMap'}).addTo(map);
    var markers={};
    function placeMarkers(){
      Object.keys(markers).forEach(function(id){ try{ map.removeLayer(markers[id]); }catch(e){} });
      markers={};
      var bounds=[];
      GEMS.forEach(function(g){
        var ll=[g.lat,g.lng]; bounds.push(ll);
        var imgSrc = Array.isArray(g.images) && g.images.length ? g.images[0] : g.image_url;
        var img = imgSrc ? '<img class="gem-img" src="'+imgSrc+'" alt="'+(g.name||'')+'"/>' : '';
        var html = img + '<b>'+g.name+'</b><br><small>'+g.where+'</small>' + (g.teaser ? '<div class="text-xs mt-1">'+g.teaser+'</div>' : '');
        markers[g.id]=L.marker(ll).addTo(map).bindPopup(html);
      });
      if(bounds.length){ try{ map.fitBounds(bounds,{padding:[20,20]}); }catch(e){} }
    }

    // Sidebar list
    var origin={lat:19.876, lng:75.343};
    var tag='all', query='';
    function renderList(){
      var wrap = document.getElementById('nearbyList'); if(!wrap) return; wrap.innerHTML='';
      var data = (GEMS||[])
        .filter(function(g){ return tag==='all' || (Array.isArray(g.tags) && g.tags.includes(tag)); })
        .filter(function(g){ var t=(g.name+g.where+g.teaser).toLowerCase(); return !query || t.includes(query.toLowerCase()); })
        .map(function(g){ return Object.assign({}, g, { dist: km(origin, {lat:g.lat,lng:g.lng}) }); })
        .sort(function(a,b){ return a.dist-b.dist; });
      data.forEach(function(g){
        var btn=document.createElement('button');
        btn.className='w-full text-left p-3 rounded-xl border border-gray-100 hover:bg-gray-50 overflow-hidden grid grid-cols-[52px,1fr,auto] items-center gap-3';
        btn.innerHTML='\
          <div class="w-12 h-12 rounded-lg bg-sky-100 grid place-items-center font-bold text-sky-700 flex-shrink-0">'+g.dist+'<span class="text-[10px] font-normal ml-0.5">km</span></div>\
          <div class="flex-1 min-w-0">\
            <p class="font-medium leading-snug truncate">'+g.name+'</p>\
            <p class="text-xs text-gray-500 truncate">'+g.where+' &middot; '+(Array.isArray(g.tags)?g.tags.join(', '):'')+'</p>\
            <p class="text-xs text-gray-600 mt-1 truncate">'+(g.teaser||'')+'</p>\
          </div>\
          <a target="_blank" class="inline-flex justify-center px-3 py-1.5 rounded-lg btn-primary text-sm shrink-0 w-[72px] text-center" href="'+WA_BASE+'?text='+encodeURIComponent('Plan route to: '+g.name+' ('+g.dist+'km)')+'">Plan</a>';
        btn.addEventListener('click',function(e){ if((e.target && e.target.tagName||'').toLowerCase()==='a') return; var m=markers[g.id]; if(m){ map.setView(m.getLatLng(),10,{animate:true}); m.openPopup(); }});
        wrap.appendChild(btn);
      });
    }

    // Events
    var originSelect=document.getElementById('originSelect');
    if(originSelect){ originSelect.addEventListener('change',function(e){ var v=e.target.value.split(','); origin={lat:parseFloat(v[0]),lng:parseFloat(v[1])}; map.setView([origin.lat,origin.lng],8); renderList(); var cta=document.getElementById('ctaWA'); if(cta) cta.href=WA_BASE+"?text="+encodeURIComponent('Hidden Gems near '+v[0]+','+v[1]); }); }
    var useLoc=document.getElementById('useLoc');
    if(useLoc){ useLoc.addEventListener('click',function(){ if(!navigator.geolocation){ alert('Geolocation not supported'); return; } navigator.geolocation.getCurrentPosition(function(pos){ origin={lat:pos.coords.latitude,lng:pos.coords.longitude}; map.setView([origin.lat,origin.lng],9); renderList(); var cta=document.getElementById('ctaWA'); if(cta) cta.href=WA_BASE+"?text="+encodeURIComponent('Hidden Gems near my location ('+origin.lat.toFixed(3)+','+origin.lng.toFixed(3)+')'); }, function(){ alert('Could not get location'); }); }); }
    Array.prototype.forEach.call(document.querySelectorAll('.fbtn'), function(b){ b.addEventListener('click', function(){ tag=b.dataset.tag; Array.prototype.forEach.call(document.querySelectorAll('.fbtn'), function(x){ x.classList.remove('chip-active'); x.setAttribute('aria-pressed','false'); }); b.classList.add('chip-active'); b.setAttribute('aria-pressed','true'); renderList(); }); });
    var q=document.getElementById('q'); if(q){ q.addEventListener('input', function(e){ query=e.target.value||''; renderList(); }); }

    // Load data then render
    fetch('/api/gems.json',{headers:{accept:'application/json'}})
      .then(function(r){ return r.json(); })
      .then(function(json){
        var meta = document.getElementById('nbMeta');
        if (json && Array.isArray(json.data) && json.data.length) {
          GEMS = json.data;
          if (meta) meta.textContent = '(' + GEMS.length + ' places from DB)';
        } else if (json && Array.isArray(json.data) && json.data.length === 0) {
          if (meta) meta.textContent = '(0 from DB — check RLS/published)';
          GEMS = fallback();
        } else {
          if (meta) meta.textContent = '(fallback data)';
          GEMS = fallback();
        }
      })
      .catch(function(){
        var meta = document.getElementById('nbMeta');
        if (meta) meta.textContent = '(fallback due to error)';
        GEMS = fallback();
      })
      .finally(function(){ placeMarkers(); renderList(); });
  });
})();
