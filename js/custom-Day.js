$(document).ready(function () {




});



deviceDAYDropdownValChanged = function()
{
  //var list = [];

  $body = $("body");
  $body.addClass("loading");
  var currDevSel = $('#sel1').val();
  var currDaySel = $('#sel2').val();
  if(currDaySel == "DAY!")
  {
deviceDropdownValChanged();
  }
  else
  {
    $.ajax({
    type: "GET",
    url: "DayWiseNormalized/" + currDevSel + "-CosineSimilarity.csv",
    dataType: "text",
    success: function(data) {
      var allTextLines = data.split(/\r\n|\n/);
      var index = 0;
      for(var i=1; i < allTextLines.length; i++) {
        var dictionary = {};
        
        var rowData = allTextLines[i].split(',');
        if(Number(rowData[3]) < currDaySel)
          continue;
        else if(Number(rowData[3]) > currDaySel)
          break;
        else {
          var tempList = getDeviceAndDayData(rowData[1], rowData[4], index, rowData[6]);
          index++;
          //dictionary["device"] = rowData[1];
          //dictionary["data"] = tempList;
          //list.push(dictionary);
        }
      }
      if(index == 0)
      {
        alert(" No Data Generated by Sensor, Please change the entered day!");
          $body = $("body");
  $body.removeClass("loading");
      }
      //var a = [];
      //processData(data, 0);
      //getSimilaryPlots(currDevSel);
    },
    error: function(xhr, ajaxOptions, thrownError) {
      alert("Status: " + xhr.status + "     Error: " + thrownError);
    }
  });
  }
  
    //$body.removeClass("loading");
  }

  getDeviceAndDayData = function(deviceId, dateOrig, index, cosVal) {
    var timeStamps = [];
    $.ajax({
      type: "GET",
      url: "Normalized_Data/" + deviceId + "-motion-Normalized.csv",
      dataType: "text",
      success: function(data) {
        var allTextLines = data.split(/\r\n|\n/);
        for(var i=1; i < allTextLines.length; i++) {
          var rowData = allTextLines[i].split(',');
          var date = new Date(Number(rowData[1]));
          var formattedDate = getFormattedDate(date);
          var entryStarted = false;
          if(dateOrig.indexOf(formattedDate) == -1) {
            if(entryStarted == true)
              break;

            continue;
          } else {
            entryStarted = true;
          //var obj = new DeviceTimeAndMotion();
          timeStamps.push([new Date(Number(rowData[1])), parseFloat(rowData[2])]);
        }
      }

      // PLotting current
      plotGraph(timeStamps, deviceId, index, cosVal, dateOrig);
    },
    error: function(xhr, ajaxOptions, thrownError) {
      alert("Status: " + xhr.status + "     Error: " + thrownError);
    }
  });

  }


  plotGraph = function(data, device, index, cosSim, dateOrig)
  {   
   var divID = "adiv" + index; 
   if(index == 0)
   {
    divID = "adiv";
  }
  $('#'+divID).show();

  g = new Dygraph(
   document.getElementById(divID),
   data,
        //"6-motion-Normalized_V2.csv",
        {
         labels: [ "timstamp", "motion" ],
         rightGap: '5',
         animatedZooms: true,
         axes: {
          x: {
            drawGrid: false
          },
          y: {
            gridLineColor: 'blue'
          }
        }
      }
      );


 if(index != 0)
{

  $('#'+divID).prev('.eachInfoDiv').show();
  $('#'+divID).prev('.eachInfoDiv').find('.infoDivText').text('DEVICE - ' + device + ' | COSINE SIMILARITY - ' + cosSim + ' | DATE - ' + dateOrig);
  // $('#'+divID).attr("data-device", currObj.compareddevice);
  // $('#'+divID).attr("data-cosinesim", currObj.cosinesim);
  // $('#'+divID).attr("data-featurevector", currObj.featurevector);

}     
if(index == 10)
{
     $body = $("body");
  $body.removeClass("loading");
}
}
getFormattedDate = function(date) {
  var year = date.getFullYear().toString().substring(2);
            /// Add 1 because JavaScript months start at 0
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '-' + day + '-' + year;
          }



          deviceDropdownValChanged = function()
          {
            var currDevSel = $('#sel1').val();
            if(currDevSel  != "Device ID!")
            {
              $body = $("body");
              $body.addClass("loading");


              $.ajax({
                type: "GET",
                url: "Normalized_Data/" + currDevSel + "-motion-Normalized.csv",
                dataType: "text",
                success: function(data) {
                  processData(data, 0, null);
      //getSimilaryPlots(currDevSel);
    },
    error: function(xhr, ajaxOptions, thrownError) {
      alert("Status: " + xhr.status + "     Error: " + thrownError);
    }
  });
            }
            $body.removeClass("loading");
          }


          processData = function(data, index, currObj)
          {
           var allTextLines = data.split(/\r\n|\n/);
           var lines = [];

           for (var i = 1; i < allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
        //var tarr = [];
        if (data.length == 3) {
         lines.push([new Date(Number(data[1])), parseFloat(data[2])]);
           //tarr.push();          
          //lines.push(Number(data[1]), parseFloat(data[2]));                      
        }
        //lines.push(tarr);
      }
      var divID = "adiv" + index; 
      if(index == 0)
      {
        divID = "adiv";
      }
      $('#'+divID).show();

      g = new Dygraph(
       document.getElementById(divID),
       lines,
        //"6-motion-Normalized_V2.csv",
        {
         labels: [ "timstamp", "motion" ],
         rightGap: '5',
         animatedZooms: true,
         axes: {
          x: {
            drawGrid: false
          },
          y: {
            gridLineColor: 'blue'
          }
        }
      }
      );


      if(index != 0)
      {

        $('#'+divID).prev('.eachInfoDiv').show();
        $('#'+divID).prev('.eachInfoDiv').find('.infoDivText').text('DEVICE - ' + currObj.compareddevice + ' | COSINE SIMILARITY - ' + currObj.cosinesim + ' | FEATURE VECTOR LENGTH - ' + currObj.featurevector);
  // $('#'+divID).attr("data-device", currObj.compareddevice);
  // $('#'+divID).attr("data-cosinesim", currObj.cosinesim);
  // $('#'+divID).attr("data-featurevector", currObj.featurevector);
  
}     
if(index == 9)
{
 $body = $("body");
 $body.removeClass("loading");
}
}

