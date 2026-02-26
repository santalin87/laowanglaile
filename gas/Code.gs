function doGet(e) {
  var action = e.parameter.action;
  
  if (action === 'getWordCloud') {
    return handleGetWordCloud();
  } else if (action === 'search') {
    var keyword = e.parameter.keyword;
    return handleSearch(keyword);
  }
  
  return createJsonResponse({ error: 'Invalid action or missing action parameter' }, 400);
}

// 跨域请求处理 (CORS) - doGet 默认支持 JSONP，但如果前端用 fetch，GAS 会自动处理重定向
// 返回 JSON 格式数据
function createJsonResponse(data, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// 获取词云数据
function handleGetWordCloud() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  var wordCount = {};
  // 简单的停用词表，可根据需要扩展
  var stopWords = ['the', 'is', 'in', 'and', 'to', 'a', 'of', 'for', 'it', 'that', 'you', 'this', 'on', 'with', 'as', 'are', 'be', 'was', 'or', 'at', 'by', 'an', 'not', 'if', 'but', 'from', 'they', 'we', 'about', 'my', 'me', 'so', 'what', 'can', 'will', 'just', 'like', 'do', 'how', 'there', 'out', 'all', 'up', 'one', 'when', 'your', 'have', 'would', 'which', 'their', 'who', 'some', 'them', 'because', 'could', 'then', 'than', 'other', 'now', 'its', 'over', 'also', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'];
  
  // 跳过表头 (i=1)
  for (var i = 1; i < data.length; i++) {
    var text = data[i][2]; // C列: Text
    if (text) {
      var words = text.toString().toLowerCase().match(/\b[a-z]{3,}\b/g);
      if (words) {
        words.forEach(function(word) {
          if (stopWords.indexOf(word) === -1) {
            wordCount[word] = (wordCount[word] || 0) + 1;
          }
        });
      }
    }
  }
  
  var result = Object.keys(wordCount).map(function(key) {
    return { name: key, value: wordCount[key] };
  });
  
  // 排序并取前 100 个高频词
  result.sort(function(a, b) { return b.value - a.value; });
  result = result.slice(0, 100);
  
  return createJsonResponse(result);
}

// 搜索关键词
function handleSearch(keyword) {
  if (!keyword) {
    return createJsonResponse({ error: 'Keyword is required' }, 400);
  }
  
  keyword = keyword.toLowerCase();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  var results = [];
  
  // 跳过表头 (i=1)
  for (var i = 1; i < data.length; i++) {
    var videoId = data[i][0]; // A列: Video_ID
    var startTime = data[i][1]; // B列: Start_Time
    var text = data[i][2] ? data[i][2].toString() : ''; // C列: Text
    
    if (text.toLowerCase().indexOf(keyword) !== -1) {
      results.push({
        videoId: videoId,
        startTime: startTime,
        text: text
      });
    }
  }
  
  return createJsonResponse(results);
}
