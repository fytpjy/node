$(function(){
    $.ajax({
        url: "http://192.168.3.93:3000/fastread/getlist",
        type: 'post',
        dataType: 'json',
        // xhrFields: {
        //     withCredentials: true
        // },
        data: {page: 1,count: 30},
        success: function(json){
            if(json.code==1){
                var myTemplate = Handlebars.compile($("#template").html());
                $('#dataTables').html(myTemplate(json.data));
                $('#dataTables').DataTable({
                    dom: 'Bfrtip',
                    buttons: [
                        'copyHtml5',
                        'excelHtml5',
                        'csvHtml5',
                        'pdfHtml5'
                    ]
                });
            }
        }
    })
}())