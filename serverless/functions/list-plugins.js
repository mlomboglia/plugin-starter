const TokenValidator = require('twilio-flex-token-validator').validator;

exports.handler = (context, event, callback) => {
  console.log("Context:" + context.ACCOUNT_SID);
  console.log("Context:" + context.AUTH_TOKEN);

  var token = "eyJ6aXAiOiJERUYiLCJraWQiOiJTQVNfUzMtS01TX3YxIiwiY3R5IjoidHdpbGlvLWZwYTt2PTEiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..ec9y6rzLbZtBWVor.KnVLTysq2gPH9hrOF0PzuT_LbmS9WTjBVcpDP6Vkzir2BTW8t6YqRtxitr77SRQBfynZiIHT2hqzEbNfxe4QCAgyOADYXS7HknQlBPHrELtYyjVll6FgSNXiyt0FQ_nJQfcTKquN6gRGxYZvsLe1CVMYo9cS_thqW4WF2-9Fp_OgtbM83-TdN_nriYTMMZSv0rsZmEdn19Ocasj4azBNJWnYIkv6vpfHrJucqUbCF4x4VvXKVcAQvvSsgqiX8r9DxEK8hR9du2P3S59vDP8NHxi7qQSe2ruxxt1eYnxY-1XMLcSGq9HZmMkw7CferSifObACJO5HTf6425y55Fe98OedQavxzgjOTBrjksyzvLiO0F8EaeZ0W-TeEve7XUWjOjJPsCdkpoJl5iA679XUhXSW2BxDYraTzzCEyXRqO1a6jo7jxAuERzblSfsP8Lr6pKOnLAy3GOG95B6le0rv31lrFIxkuHnLwFu0sPvUXb3WsQenvLS-g5Iev5yB0NJIBMLF1jQY9SZybSLbzcCX3uPVu99rhwQvZRqZqXvecIf1B5YJeFcqPpkWNzmuKA5d9t6_peaITre7QsdXeUEz1miQbajOad_zaquDodhe-uxE4GGHhdSdI2NYAMj3DzJ3bo-csKPZcmWvue0bAZVBS9UAXmz9IpPOrDRKGRbY7ajqcwPFw5I1B178GOvXbusbDKSmEkaFEwAMmkPovDbNcHimWvoNGJN-tQE3UmNtSDi9hrace2xArIsIYIfOMjWM7_Gq8M2sjp0hkR9PvRyVrpMZU2HAZsdLeU7zAGgWaa9JL2Y4RdxIU5g-euJQA0YejvZ1zPTaPwkbBAcgucx6dhdrLGJSR-jZccwPF4y5VNuwyIc3IerxorZhc-shBKpzgREyIkbpCHbpJlU2jhV-jxS3gNQgbVNjVLGdH89VpmUoVFy1vPaIrg1wQx50Ye-nYYCvOPp9Hj7VhjCoRq66CQC26GjcUN2K3xWhpRTdb3DLv9YxuFGT3PA7ct0Z55ht3Ktp2Bc2nkVlSaeqE3sIf8Elz78qNFtuZQrXjt88OrspYew66Bn5KlscmjGMfjFZeaXjOSb-N89F-bMl3to1-NEpkRV6qFBsnq9pthGd9OMWRAVkoURDO2L6dvFG9m4s3kU3XllaQ2w-VZTY9fNZjk2e_9bAoTPWj6U8mCdGTSxMxoiVe1m62rxUN-J2N7oyk7LL70bXSrp7YqalQ_VUDE1RsdvtM9EKJSD9vWAPJEKwM1xiIZApRygMCLWmCC1F_mTWU0eVqYNFV3TNRlwM2pmPc4RxmT7Lro6JW_KRnUjn51hu8FTiBzMO1mE7tJe0eQtPfZXKrVOMjdTZRbNKLLKRm0ivohMCYX3JacrXe6J8yZR1zm-1Ka3nim3QxCuRJ97xqeoKyORnJNxrKPJvoDK2kTFJtWFnWw9joo7TmcGcMwMNLKJsIBYh3g5t-XEow0dohl6jPZtCVEw_8NNYBtSulbp-Q05BephHpa5la1M3MpB9Qw8hqBcZRbH7SZVIA7vYejQI7szlOkwP7GIqOil18gPrrpFubpjWJGYLCODiob7JE6AfmcwFG9LPMghUNblHx042XL8RMrdItZU0IV7VKG50kNleIHqwKDBd9rFdIwIV.2kLN2KLBK3FVfOlABQvMzQ"
  
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
