$(document).ready(function(){

    $(".submit").click(function(){
        $("#homelogo").animate({
            width: '20%',
            height: '20%',
        });

        $("#topSpacer").animate({
            margin: '1%'
        })

        $("#heartrate").toggle()
        $("#elevations").toggle()


    });

});