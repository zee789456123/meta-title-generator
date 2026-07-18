(function () {
  'use strict';

  var stopWords = 'the a an and or for to of in on with from your our this that is are as by how what guide best free services service company businesses business'.split(' ');
  var acronyms = {seo:'SEO',aeo:'AEO',geo:'GEO',gso:'GSO',llmo:'LLMO',ai:'AI',serp:'SERP',sem:'SEM',ppc:'PPC',ctr:'CTR',cpc:'CPC',cpa:'CPA',cpm:'CPM',roas:'ROAS',roi:'ROI',cro:'CRO',crm:'CRM',cms:'CMS',kpi:'KPI',api:'API',ga4:'GA4',url:'URL',cta:'CTA',cac:'CAC',ltv:'LTV',b2b:'B2B',b2c:'B2C',saas:'SaaS',dj:'DJ',pmax:'PMax',eeat:'E-E-A-T',ymyl:'YMYL',nap:'NAP',sge:'SGE',aio:'AIO',rag:'RAG',faq:'FAQ',ux:'UX',ui:'UI'};

  function titleCase(value) {
    return value.replace(/\b[a-z0-9-]+\b/gi, function (word) {
      return acronyms[word.toLowerCase()] || word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  }

  function suggestPhrases(text) {
    var words = text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(function (word) {
      return word.length > 2 && stopWords.indexOf(word) < 0;
    });
    var phrases = [];
    for (var size = 3; size > 0; size -= 1) {
      for (var index = 0; index <= words.length - size; index += 1) {
        var phrase = words.slice(index, index + size).join(' ');
        if (phrases.indexOf(phrase) < 0) phrases.push(phrase);
      }
    }
    return phrases.slice(0, 6);
  }

  function detectIntent(text) {
    var value = text.toLowerCase();
    if (/\b(buy|book|hire|order|quote|pricing|near me|shop)\b/.test(value)) return 'transactional';
    if (/\b(compare|best|review|top|versus|vs\.?|alternative)\b/.test(value)) return 'commercial';
    return 'info';
  }

  function competitorValues() {
    return Array.prototype.map.call(document.querySelectorAll('.competitor-input'), function (input) { return input.value.trim(); }).filter(Boolean);
  }

  function analyzeCompetitors(titles) {
    if (!titles.length) return '';
    var signals = [];
    if (titles.some(function (title) { return /\d/.test(title); })) signals.push('numbers');
    if (titles.some(function (title) { return /[:|—-]/.test(title); })) signals.push('title separators');
    if (titles.some(function (title) { return /\b(best|top|guide|how|compare|review)\b/i.test(title); })) signals.push('intent words');
    return titles.length + ' competitor title' + (titles.length === 1 ? '' : 's') + ' analyzed' + (signals.length ? ': common patterns include ' + signals.join(', ') : ': no strong pattern found') + '.';
  }

  function templatesFor(intent, keyword) {
    if (intent === 'transactional') return ['Get a Quote for ' + keyword, 'Affordable ' + keyword + ' Services', 'Hire Trusted ' + keyword + ' Experts', 'Book ' + keyword + ' Today', keyword + ' Services Near You'];
    if (intent === 'commercial') return ['Best ' + keyword + ': Compare Your Options', 'Top ' + keyword + ' for Better Results', keyword + ' Reviews and Recommendations', 'How to Choose the Right ' + keyword, keyword + ': Features, Benefits and Costs'];
    return [keyword + ' Guide: What You Need to Know', 'How to Improve ' + keyword, keyword + ' Tips for Better Results', 'Learn How ' + keyword + ' Works', keyword + ': A Practical Guide'];
  }

  function fitTitle(base, keyword, brand) {
    var suffix = brand ? ' | ' + brand : '';
    var full = titleCase(base + suffix);
    if (full.length <= 60) return full;
    var withoutBrand = titleCase(base);
    if (withoutBrand.length <= 60) return withoutBrand;
    var fallback = titleCase(keyword + (brand ? ' | ' + brand : ' Guide'));
    return fallback.length <= 60 ? fallback : titleCase(keyword).slice(0, 60).trim();
  }

  var competitors = document.getElementById('competitors');
  for (var number = 1; number <= 5; number += 1) {
    var wrapper = document.createElement('div');
    wrapper.className = 'competitor-field';
    var label = document.createElement('label');
    label.htmlFor = 'competitor-' + number;
    label.className = 'visually-hidden';
    label.textContent = 'Competitor title ' + number;
    var input = document.createElement('input');
    input.id = 'competitor-' + number;
    input.className = 'competitor-input';
    input.placeholder = 'Competitor title ' + number;
    input.maxLength = 100;
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    competitors.appendChild(wrapper);
  }

  document.getElementById('suggest').addEventListener('click', function () {
    var phrases = suggestPhrases(document.getElementById('content').value);
    var chips = document.getElementById('chips');
    chips.innerHTML = '';
    phrases.forEach(function (phrase) {
      var button = document.createElement('button');
      button.className = 'chip';
      button.type = 'button';
      button.textContent = phrase;
      button.addEventListener('click', function () {
        document.getElementById('keyword').value = phrase;
        document.getElementById('status').textContent = 'Primary keyword set to ' + phrase + '.';
      });
      chips.appendChild(button);
    });
    document.getElementById('status').textContent = phrases.length ? phrases.length + ' keyword suggestions found.' : 'Add more page content to find keyword suggestions.';
  });

  document.getElementById('generate').addEventListener('click', function () {
    var content = document.getElementById('content').value.trim();
    var keyword = document.getElementById('keyword').value.trim() || suggestPhrases(content)[0] || '';
    var error = document.getElementById('error');
    if (!keyword) {
      error.textContent = 'Add a primary keyword or enough page content to suggest one.';
      error.hidden = false;
      document.getElementById('results').hidden = true;
      document.getElementById('keyword').focus();
      return;
    }
    error.hidden = true;
    var selectedIntent = document.getElementById('intent').value;
    var intent = selectedIntent === 'auto' ? detectIntent(keyword + ' ' + content) : selectedIntent;
    var brand = document.getElementById('brand').value.trim();
    var competitorTitles = competitorValues();
    var insight = document.getElementById('competitor-insight');
    var analysis = analyzeCompetitors(competitorTitles);
    insight.textContent = analysis;
    insight.hidden = !analysis;
    var titles = templatesFor(intent, keyword);
    if (intent !== 'transactional' && competitorTitles.some(function (title) { return /\d/.test(title); })) titles[1] = '5 Ways to Improve ' + keyword;
    var output = document.getElementById('output');
    output.innerHTML = '';
    titles.forEach(function (base) {
      var title = fitTitle(base, keyword, brand);
      var result = document.createElement('div');
      result.className = 'result';
      var heading = document.createElement('b');
      heading.textContent = title;
      var meta = document.createElement('div');
      meta.className = 'meta' + (title.length < 30 || title.length > 60 ? ' warning' : '');
      meta.textContent = title.length + ' characters · ' + titleCase(intent) + ' intent';
      result.appendChild(heading);
      result.appendChild(meta);
      output.appendChild(result);
    });
    document.getElementById('results').hidden = false;
    document.getElementById('results-heading').focus();
  });

  document.getElementById('suggest').click();
}());
