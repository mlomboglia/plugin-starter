const TokenValidator = require('twilio-flex-token-validator').validator;

exports.handler = (context, event, callback) => {
  console.log("Context:" + context.ACCOUNT_SID);
  console.log("Context:" + context.AUTH_TOKEN);

  var token = "eyJ6aXAiOiJERUYiLCJraWQiOiJTQVNfUzMtS01TX3YxIiwiY3R5IjoidHdpbGlvLWZwYTt2PTEiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..UAmJDArpqyQzpxwC.3BZ0xHbHXIobKtKelHvsqu_5A5xsNMJVLUPtfXDtEY7vdEwDEApM9e16UL1VYTum9oK7LQA4VjPWVZuBkquZm_YVKjEfli-3wCvxi6kSSg9Gflg3lL1xB2eYIC06DCK2Man3Xn_RSzDrrso6Roaa-EoxzwUa3VNWr9a8geXi7t9sLCZV8yQcTIlPNW6V8mWCB8ZOyq4VOxwPHTzWOtfq0eX5eFonO_CgfzMO-QLqBftmhTTGNbX7x6V0CUaCc5WpOSM70GTFhyKRYFxEUG0FXKwUFbLJYltHuHn4gxCvxi5mfAcxvgsYjnfg3yE4CZHFoRb0y3iCYSyZPH57QZrlXcPEZMFXSTysHFvgMoCPqiY1yTKmq30YCpmjxYbeTo7jdRVss3p_k4lcG6mHBk1duEzwXOSPAzjNKVzroXZWIfS3lEgYPUBwFfaAy39dMmQLZBzd5GhMn8VgXFQJd_Qfnv82SvBhKssl3tnw2zU1pmiDuZYOtbH1pZVw4ELt_50jdM8amF_hPCeesxnm5m9IUMkg1cZ2KEfG6NFdcvtKs7FGGLGR-n-Xy0TssIYMsrJaXycZYAe-2XbYTpk_7DP0VCpL0Yf-HHhRIFQ3OcrqbHDmf2lli6v8aYS1dfZ4GQ7QHoCbvCnYFTFNxmFB2wMTu-lTYoK-cF_XD9HUCGGrKDpQR6Mqd1-sdqcQOOjQ28Aurq4Im6nsP_5NO-6RHlEbiOSTIlsD_VonCjFfZF3rmv10OJbnPp_14NwTeseGVQGSiMROPPHTAXY3z3VlxIHKUGZdf09klKT4k3f423NAdSh14XE3kWdVYr3eH0bQ-XMPGR3s8qUiuYkhC3AJxduzrl0wPKnvI7UISLdENYLHpUTZx-fgZZk0KFgp7rHK9-Yzerhsy83N9Cn2XvYlWatThtg-2s02DyNgEtlZnr6b-8XYKMtWojfVbSSnqROIb5jDQONMJ4i6oHuymrlDRhieQkMKdAJEKn-ERkoHyIl79BfboqHVh4nN_96tuzv57LuXhekJfqa8p1XM8K3bcN7cnxIJPOonaijr8dQorn5e6cJV5PJZuB3hAvtuPUMXQ9DkP2S71_8Af4JPGd37Lq5M_RyRBJ4xmu6hQ76IOj1lk4v37eK7xvguS0NSoeKcxmQ695Yk8cvR49A2jloFMMTN1hFDJPcAJ0zValoz-2d-1IlpF1_bUAZxoXLeRNL0wrPDlNrlhoPBY0i4CTdM3rTDVUFPt7xKjPmrAOlue-H-swGVcnVI1JjEkkHHIGFD5_kQ1JoMfiQqYQzirFNNLJ8Jr7K5baIAisx5G9ModVc-3rl3zs9cPV6poT-NfNbgi6rX_LAgltKcp7PAQlzeqAxLtw7Ghu6ifxqPwjbKxAYhZS7xMbXG-Qnlo7yv79_fsyTLhB5WfiefNS-YRNMVG2zYxwg-FlhBzbhXjRtEXqLqqe7cqpXIwp1EJyuAEXLHqg3jYDiMGsbl4PnuaXcjH8YYTqhxuUabaPr509f_45uwiVKH2G2bvCK5nQkXoT_eu42uUxkydjSqixf2J2oivh00n5I4EHuQGNI3Wj_REyxD8QFx938J5snj8Ldq6sDAcfuSxKfYwuwxjQhVz_PU52GXokbVVEW8FoMMfnzoDvHjtGO9BDA.ph-Vz1f7e3ncFeFwK-Lttg"

  //TokenValidator(event['X-Flex-Jwe'], context.ACCOUNT_SID, context.AUTH_TOKEN)
  TokenValidator(token, context.ACCOUNT_SID, context.AUTH_TOKEN)
    .then(tokenResult => {
      console.log("validated token", tokenResult);
      let plugins = [{
        "name":"Flex Starter Plugin",
        "src":"https://flex-plugin-starter.s3.eu-west-2.amazonaws.com/dist/master/plugin-starter.js"
      }]

      context.getTwilioClient()
        .taskrouter
        .workspaces('WS7a5c57ebe6776966d86d7a762531f118')
        .workers(tokenResult.worker_sid)
        .fetch()
        .then(worker => {
           let attributes = JSON.parse(worker.attributes);
           if (attributes.branch !== undefined) {
             plugins[0].src = plugins[0].src.replace('master', attributes.branch);
           }

           console.log(`\nreturning plugins for branch ${attributes.branch}`, plugins);
           callback(null, plugins);
        }).catch(e => {
           console.error('failed to fetch worker attributes', e);
           callback(null, plugins);
        });
    })
    .catch(err => {
      console.log(err);
      callback('Access Denied');
    });
};
