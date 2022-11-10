$(document).ajaxStart(function () {
    NProgress.configure({
        showSpinner: false
    });
    NProgress.start();
});

$(document).ajaxStop(function () {
    NProgress.done();
});

const TOKEN_COOKIE = getCookie('token');

const ACTIVITIES = {
    1: 'Counseling',
    2: 'Testing (Administration, interpretation, etc.)',
    3: 'Consultation (Inquiry, parent\'s conference, etc.)',
    4: 'Information (Seminars, group sessions, etc.)',
    5: 'Placement (Career inquiries, mock interview, etc.)',
    6: 'Others (Clearance items, Tutorials, etc.)'

}

// cookie functions
function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function eraseCookie(name) {
    setCookie(name, "", -1);
}

// difference between two strings
function symmetricDifference(a1, a2) {
    var result = [];
    for (var i = 0; i < a1.length; i++) {
        if (a2.indexOf(a1[i]) === -1) {
            result.push(a1[i]);
        }
    }
    for (i = 0; i < a2.length; i++) {
        if (a1.indexOf(a2[i]) === -1) {
            result.push(a2[i]);
        }
    }
    return result;
}

//kiosk functions

function stepOneEnableDisable() {
    var idnumber = $('#idnumber').val();
    if (idnumber.length == 9) {
        if (idnumber.match(/[0-9]{4}-[0-9]{4}/g)) {
            $("#steponebutton").removeAttr('disabled'); 
        } else {
            $("#steponebutton").attr('disabled', 'disabled');
        }; 
    } else { 
        $("#steponebutton").attr('disabled', 'disabled');
    }
}

function stepTwoEnableDisable() {
    if ($("input:checkbox:checked").length > 0) {
        $("#steptwobutton").removeAttr('disabled');
        $("#check-activities").removeAttr('disabled');
    } else {
        $("#steptwobutton").attr('disabled', 'disabled');
        $("#check-activities").attr('disabled', 'disabled');
    };
}


function buttonStepTwo() {
    return "<button id='steptwobutton' type='button' class='btn btn-success rounded px-3' onclick='stepTwo()' disabled><i class='fa fa-arrow-right'></i>&nbsp;Next</button>";
}

function buttonStepThree() {
    return "<button id='steptwobutton' type='button' class='btn btn-success rounded px-3' onclick='stepThree()'><i class='fa fa-arrow-right'></i>&nbsp;Next</button>";
}

function buttonStepHome() {
    return "<button id='steplastbutton' type='button' class='btn btn-success rounded px-3' onclick='stepHome();'><i class='fa fa-check'></i>&nbsp;Done</button>";
}

function buttonStepCancel() {
    return "<button id='steplastbutton' type='button' class='btn btn-danger rounded px-3' onclick='stepHome();'><i class='fa fa-times'></i>&nbsp;Cancel</button>";
}

function endServiceAppointmentEnabled() {
    return "<a><button type='button' id='end-appointment-button' class='btn btn-danger rounded submit px-3 mr-2' onclick='put_appointment_end();'><i class='fa fa-ban'></i><span class='preview'>&nbsp;End appointment</span></button></a>";
}

function endServiceAppointmentDisabled() {
    return "<a><button type='button' id='end-appointment-button' class='btn btn-danger rounded submit px-3 mr-2' onclick='put_appointment_end();' disabled><i class='fa fa-ban'></i><span class='preview'>&nbsp;End appointment</span></button></a>";
}

function emptyListRibbon () {
    return "<td colspan='6'><div class='alert alert-info'><i class='fa fa-info-circle'>" +
        "</i>&nbsp;<b>Note: </b> No pending clients for the day." +
        "</div></td>";
}


function services_checklist(value, key, isDisabled) {
    if (isDisabled == true){
        return "<label class='container' style='font-size: 16px !important; color: black !important;'><input type='checkbox' onclick='stepTwoEnableDisable(this);' value=" + value + " autocomplete='off' disabled checked='True'> <s>" + key + "</s></label>"
    } else {
        return "<label class='container' style='font-size: 16px !important; color: black !important;'><input type='checkbox' onclick='stepTwoEnableDisable(this);' value=" + value + " autocomplete='off'> " + key + "</label>"
    }
}

function stepOne() {
    idnumber = $("#idnumber").val();
    localStorage.setItem("idnumber", idnumber);
    $("#idnumber").attr("style", "display: none;");
    $("#idnumberlabel").attr("style", "display: none;");
    $("#serviceselect").attr("style", "");

    for (i = 1; i <= Object.keys(ACTIVITIES).length; i++) {
        $("#serviceselect").append(services_checklist(i, ACTIVITIES["" + i + ""]), false);
    }

    $("#infoText").html("");
    $("#infoText").append("<i class='fa fa-info-circle'></i>&nbsp;Please select your activity.");

    $("#buttonGroupNext").html("");
    $("#buttonGroupNext").append(buttonStepTwo());
    $("#buttonGroupCancel").html("");
    $("#buttonGroupCancel").append(buttonStepCancel());
};

function stepTwo() {
    var services = '';
    $("input:checkbox:checked").each(function () {
        services += $(this).val();
    });
    localStorage.setItem("services", services);

    $("#idnumber").attr("style", "display: none;");
    $("#idnumberlabel").attr("style", "display: none;")
    $("#serviceselect").attr("style", "display: none;");
    
    $("#table-booked").attr("style", "");
    $("#booked-service").append("<tr><td>ID Number </td><td>" + localStorage.getItem("idnumber") + "</td></tr>");

    activitiesConcat = '';
    for (i = 0; i < localStorage.getItem("services").length; i++) {
        activitiesConcat += "<li>" + ACTIVITIES[""+(i+1)+""] + "</li>";
    }

    $("#booked-service").append("<tr><td>Activities </td><td><ul>" + activitiesConcat + "</ul></td></tr>");

    $("#infoText").html("");
    $("#infoText").append("<i class='fa fa-info-circle'></i>&nbsp;Review your transaction.")

    $("#buttonGroupNext").html("");
    $("#buttonGroupNext").append(buttonStepThree());
};

function stepThree() {
    $("#idnumber").attr("style", "display: none;");
    $("#idnumberlabel").attr("style", "display: none;")
    $("#serviceselect").attr("style", "display: none;");

    $("#table-booked").attr("style", "display: none;");

    post_services_list();
    
    $("#infoRibbon").attr("style", "display: none;");    

    $("#buttonGroupNext").html("");
    $("#buttonGroupNext").append(buttonStepHome());
    $("#buttonGroupCancel").html("");
}

function stepHome() {
    localStorage.clear();
    window.location.reload();
}

function post_services_list() {
    return $.ajax({
        url: 'https://ogcappapi.msuiit.edu.ph/api/v1/book',
        crossDomain: true,
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + TOKEN_COOKIE
        },
        method: "POST",
        data: {
            "id": localStorage.getItem("idnumber"),
            "services": localStorage.getItem("services")
        },
        success: function (res) {
            console.log(res);
            if (res.college == 'CCS' || res.college == 'CEBA') {
                $("#kiosk-message-ribbon").html("<i class='fa fa-check'></i>&nbsp;Thank for using MSU-IIT Guidance Counseling Appointment System. Please proceed and look for Ma'am Kit inside.");
            } else if (res.college == 'CASS') {
                $("#kiosk-message-ribbon").html("<i class='fa fa-check'></i>&nbsp;Thank for using MSU-IIT Guidance Counseling Appointment System. Please proceed and look for Sir Mike inside.");
            } else if (res.college == 'CON' || res.college == 'CSM') {
                $("#kiosk-message-ribbon").html("<i class='fa fa-check'></i>&nbsp;Thank for using MSU-IIT Guidance Counseling Appointment System. Please proceed and look for Ma'am Chay inside.");
            } else if (res.college == 'CED') {
                $("#kiosk-message-ribbon").html("<i class='fa fa-check'></i>&nbsp;Thank for using MSU-IIT Guidance Counseling Appointment System. Please proceed and look for Ma'am Reyn inside.");
            } else {
                $("#kiosk-message-ribbon").html("<i class='fa fa-check'></i>&nbsp;Thank for using MSU-IIT Guidance Counseling Appointment System. Please proceed to your corresponding counselor.");
            }

            $("#successRibbon").attr("style", "");
        }
    });

}

// counselor functions

// client list table format
function client(name, college, activities, studid, counselor, remarks) {
    activitiesConcat = '';
    for (i = 0; i < activities.length; i++) {
        var activity_index = parseInt(activities[i]);
        activitiesConcat += "<li>" + ACTIVITIES["" + activity_index + ""] + "</li>"
    }

    row = "<tr>" +
        "<td>" + name + "</td>" +
        "<td>" + college + "</td>" +
        "<td>" + counselor + "</td>" +
        "<td>" +
        "<ul id='activities_list'>" + activitiesConcat + "</ul>" +
        "</td>" +
        "<td>" + remarks + "</td>" +
        "<td>" +
        "<div class='btn-toolbar' role='toolbar' style='display: flex; justify-content: space-between;'>" +
        "<div class='btn-group mr-2' role='group' aria-label='First group'>" +
        "<button class='btn btn-primary view-button' value=" + studid + ">View</button>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>"

    return row
}

// client list row format
function append_clients(name, college, activities, studid, counselor, remarks) {
    $("#clients").append(client(name, college, activities, studid, counselor, remarks));
}

// endpoint for services list
function get_services(services) {
    return $.ajax({
        url: 'https://ogcappapi.msuiit.edu.ph/api/v1/services',
        crossDomain: true,
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + TOKEN_COOKIE
        },
        method: "GET",
        data: {
            "services": services
        },
        success: function (res) {
            console.log(res);
        }
    }); 
}

// endpoint for client data
function get_client_data() {
    var id = localStorage.getItem("id"),
        username = $("#username").val();
    return $.ajax({
        url: 'https://ogcappapi.msuiit.edu.ph/api/v1/client',
        crossDomain: true,
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + TOKEN_COOKIE
        },
        method: "GET",
        data: {
            "id": id
        },
        success: function (res) {
            var services_index = (res.services_index).toString(),
                finished_services = (res.finished_services) ? (res.finished_services).toString() : null,
                unfinished_services = null;
            
            var client_name = res.client_name ? res.client_name: '',
                college = res.college ? res.college: '',
                client_id = res.client_id ? res.client_id: '',
                counselor = res.counselor ? res.counselor: '',
                previous_counselor = res.previous_counselor ? res.previous_counselor: '';

            if (res.remarks == "PENDING") {
                $("#personal-info-container-large").attr("style", "justify-content: space-between;");
                
                client_data_display("client-large", client_name, client_id, college);

                $("#entertain-button").attr("style", "");

            } else if (res.remarks == "ONGOING") {
                $("#evaluatorNav").append(display_ribbon("info", "current", counselor));    

                $("#counselorNavBar").append(endServiceAppointmentDisabled());
                
                if (res.counselor == username) {
                    if (services_index != finished_services) {
                        if (finished_services != null) {
                            unfinished_services = symmetricDifference(services_index, finished_services); 
                        } else {
                            unfinished_services = services_index.replace(finished_services, '');
                        }
                    } else {
                        unfinished_services = null;
                        $("#counselorNavBar").html("");
                        $("#counselorNavBar").append(endServiceAppointmentEnabled());
                    }

                    if (unfinished_services) {
                        for (i = 0; i < unfinished_services.length; i++) {
                            $("#booked-services").append(services_checklist(unfinished_services[i], ACTIVITIES["" + unfinished_services[i] + ""], false));
                        }
                    }

                    if (finished_services) {
                        for (i = 0; i < finished_services.length; i++) {
                            $("#booked-services").append(services_checklist(finished_services[i], ACTIVITIES["" + finished_services[i] + ""], true));
                        }
                    }

                    $("#personal-info-container").attr("style", "justify-content: space-between;");
                    $("#booked-services-container").attr("style", "justify-content: space-between;");

                    client_data_display("client", client_name, client_id, college);

                } else {
                    $("#personal-info-container-large").attr("style", "justify-content: space-between;");

                    client_data_display("client-large", client_name, client_id, college);;
                }

            } else if (res.remarks == "DONE") {
                $("#evaluatorNav").append(display_ribbon("info", "previous", previous_counselor));  

                if (services_index != finished_services) {
                    unfinished_services = services_index.replace(finished_services, '');
                } else {
                    unfinished_services = null;
                    $("#counselorNavBar").html("");
                    $("#counselorNavBar").append(endServiceAppointmentEnabled());
                }

                if (unfinished_services) {
                    for (i = 0; i < unfinished_services.length; i++) {
                        $("#booked-services").append(services_checklist(unfinished_services[i], ACTIVITIES["" + unfinished_services[i] + ""], false));
                    }
                }

                if (finished_services) {
                    for (i = 0; i < finished_services.length; i++) {
                        $("#booked-services").append(services_checklist(finished_services[i], ACTIVITIES["" + finished_services[i] + ""], true));
                    }
                }

                $("#personal-info-container").attr("style", "justify-content: space-between;");
                $("#booked-services-container").attr("style", "justify-content: space-between;");

                $('#end-appointment-button').attr("style", "display: none;");
                $('#check-activities').attr("style", "display: none;");
                
                client_data_display("client", client_name, client_id, college);
            }
        }
    });
}

// endpoint for client list 
function get_client_list() {
    localStorage.clear();
    return $.ajax({
        url: 'https://ogcappapi.msuiit.edu.ph/api/v1/client/all',
        crossDomain: true,
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + TOKEN_COOKIE
        },
        method: "GET",
        success: function (res) { 
            if (res.list.length != 0) {
                for (var i = 0; i < res.list.length; i++) {
                    var client_name = res.list[i].client_name,
                        college = res.list[i].college ? res.list[i].college : '',
                        services = res.list[i].services,
                        studid = res.list[i].studid,
                        counselor = res.list[i].entertainedby ? res.list[i].entertainedby : '',
                        remarks = res.list[i].remarks ? res.list[i].remarks : '';

                    append_clients(client_name, college, services, studid, counselor, remarks);
                }

                $(".view-button").bind().one('click', function () {
                    var id = $(this).val();
                    localStorage.setItem("id", id);
                    location.href = "/counseling/client";
                });
            } else {
                $("#clients").append(emptyListRibbon());
            }
        }
    });
}

// endpoint for tagging counselor/frontdesk to client
function put_counselor() {
    var id = localStorage.getItem("id"),
        username = $("#username").val();
    return $.ajax({
        url: 'https://ogcappapi.msuiit.edu.ph/api/v1/counsel',
        crossDomain: true,
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + TOKEN_COOKIE
        },
        method: "PUT",
        data: {
            "id": id,
            "counselor": username
        },
        success: function (res) {
            console.log(res);
            location.href = '/counseling/client';
        }
    });
}

// endpoint for update of already addressed services
function put_services() {
    var id = localStorage.getItem("id");
    var services = '';
        $("input:checkbox:checked").each(function () {
        services += $(this).val();
    });
    localStorage.setItem("services", services);

    return $.ajax({
        url: 'https://ogcappapi.msuiit.edu.ph/api/v1/done',
        crossDomain: true,
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + TOKEN_COOKIE
        },
        method: "PUT",
        data: {
            "id": id,
            "finishedservices": services
        },
        success: function (res) {
            console.log(res);
            location.href = '/counseling/client';
        }
    });
}

// endpoint for appointment end
function put_appointment_end() {
    var id = localStorage.getItem("id"),
        username = $("#username").val();
    return $.ajax({
        url: 'https://ogcappapi.msuiit.edu.ph/api/v1/end-appointment',
        crossDomain: true,
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + TOKEN_COOKIE
        },
        method: "PUT",
        data: {
            "id": id,
            "counselor": username
        },
        success: function (res) {
            console.log(res);
            location.href = '/counseling/client';
        }
    });
}

function get_rating_result(token, rating) {
    return $.ajax({
        url: 'https://ogcappapi.msuiit.edu.ph/api/v1/client/rate/' + token + '/' + rating,
        crossDomain: true,
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + TOKEN_COOKIE
        },
        method: "GET",
        success: function (res) {
            console.log(res);
            if (res.hasRated == false) {
                $("#rating-message").html("<div class='alert alert-success'><span id='rating-message'><i class='fa fa-check'></i>&nbsp;" + res.message + "</span></div>");
            } else if (res.hasRated == true) {
                $("#rating-message").html("<div class='alert alert-info'><span id='rating-message'><i class='fa fa-info-circle'></i>&nbsp;" + res.message + "</span></div>");
            } else if (res.hasRated == 'Invalid') {
                $("#rating-message").html("<div class='alert alert-warning'><span id='rating-message'><i class='fa fa-exclamation-triangle'></i>&nbsp;" + res.message + "</span></div>");
            }
            
        }
    });
}

function get_client_past_transactions() {
    return $.ajax({
        url: 'https://ogcappapi.msuiit.edu.ph/api/v1/client/transactions',
        crossDomain: true,
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + TOKEN_COOKIE
        },
        method: "GET",
        data: {},
        success: function (res) {
            console.log(res.transactions);
            for (i=0; i < res.transactions.length; i++) {
                console.log(res.transactions[i].service);
                activitiesConcat = '';
                for (j = 0; j < res.transactions[i].service.length; j++) {
                    activitiesConcat += "<li>" + res.transactions[j].service + "</li>"
                }
                
                row = "<tr><td><ul>" + activitiesConcat + "</ul></td><td>" + res.transactions[i].date_started + "</td><td>" + res.transactions[i].date_finished + "</td><td>" + res.transactions[i].date_rated + "</td><td>" + res.transactions[i].rating + "</td></tr>"
                $("#transactions").append(row)
            }
        }
    });
}

// ribbon UI
function display_ribbon(ribbon_type, message, counselor) {
    if (message == "current") {
        return "<div class='alert alert-" + ribbon_type + " mb-0 mt-2'><i class='fa fa-info-circle'>" +
            "</i>&nbsp;<b>Note: </b>Client is currently being entertained by <b>" + counselor + "</b>." +
            "</div>";
    } else if (message == "new") {
        return "<div class='alert alert-" + ribbon_type + " mb-0 mt-2'><i class='fa fa-check-square-o'>" +
            "</i>&nbsp;<b>Success: </b>You are now the client's corresponding guidance counselor for the day." +
            "</div>";
    } else if (message == "previous") {
        return "<div class='alert alert-" + ribbon_type + " mb-0 mt-2'><i class='fa fa-check-square-o'>" +
            "</i>&nbsp;<b>Note: </b>Client was entertained previously by <b>" + counselor + "</b>." +
            "</div>";
    }
}

function client_data_display(container_type, client_name, client_id, college) {
    $("#" + container_type).append("<tr><td>Full name </td><td>" + client_name + "</td></tr>");
    $("#" + container_type).append("<tr><td>ID Number </td><td>" + client_id + "</td></tr>");
    $("#" + container_type).append("<tr><td>College </td><td>" + college + "</td></tr>");
}