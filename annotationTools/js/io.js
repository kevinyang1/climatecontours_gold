/** @file Input/output functions for writing annotation files to the LabelMe server. */

function ReadXML(xml_file,SuccessFunction,ErrorFunction) {
  $.ajax({
    type: "GET",
    url: xml_file,
    dataType: "xml",
    success: SuccessFunction,
    error: ErrorFunction
  });
}

function WriteXML(url,xml_data,SuccessFunction,ErrorFunction) {
    oXmlSerializer =  new XMLSerializer();

    $xml = $(xml_data);
    //old_filename = $xml.find("filename").text();
    //$xml.find("filename").replaceWith("<filename>" + sessionStorage.session_id + old_filename + "</filename>");
    if ($xml.find("tc_count").length > 0) {
        //we found something
        $xml.find("tc_count").replaceWith("<tc_count>" + tc_count + "</tc_count>");
        $xml.find("ar_count").replaceWith("<ar_count>" + ar_count + "</ar_count>");
    } else {
        $xml.find("folder").after("<tc_count>" + tc_count + "</tc_count>");
        $xml.find("tc_count").after("<ar_count>" + ar_count + "</ar_count>");
    }

    //store the sessionID into the xml
    if ($xml.find("session_id").length == 0) {
        $xml.find("folder").after("<session_id>" + sessionStorage.session_id + "</session_id>");
    }

    sXmlString = oXmlSerializer.serializeToString(xml_data);
        
    // use regular expressions to replace all occurrences of
    sXmlString = sXmlString.replace(/ xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g, "");
                                    
                        
    $.ajax({
    type: "POST",
    url: url,
    data: sXmlString,
    contentType: "text/xml",
    dataType: "text",
    success: SuccessFunction,
    error: function(xhr,ajaxOptions,thrownError) {
      console.log(xhr.status);          
      console.log(thrownError);
    }
  });
}
