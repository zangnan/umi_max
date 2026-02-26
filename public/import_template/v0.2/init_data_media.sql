

SET FOREIGN_KEY_CHECKS=0;


delete from sdp_media_mgr;
delete from eg_media_image;
delete from eg_media_video;
delete from eg_media_video_cus;

commit;

-- ----------------------------
-- Records of eg_media_image
-- ----------------------------
INSERT INTO `eg_media_image` VALUES ('5d85c01c7e744761961e43fc33f1a5aa', 'a77fe42df2074779bbccd157a48912d1', '课程标题3', '课程描述3', '2024-11-19 00:00:00', '21232f297a57a5a743894a0e4a801fc3', 'd3cfda464f46bcb0a0e1f3462085115f', '2024-11-19 00:00:00', '21232f297a57a5a743894a0e4a801fc3', 'd3cfda464f46bcb0a0e1f3462085115f');
INSERT INTO `eg_media_image` VALUES ('824f1d9f7c90453c9c7d6b4f56246c7e', '2af4fae5f0c24d4baf95dc182e93d78e', '课程标题2', '课程描述2', '2024-11-19 00:00:00', '21232f297a57a5a743894a0e4a801fc3', 'd3cfda464f46bcb0a0e1f3462085115f', '2024-11-19 00:00:00', '21232f297a57a5a743894a0e4a801fc3', 'd3cfda464f46bcb0a0e1f3462085115f');
INSERT INTO `eg_media_image` VALUES ('a354f07ace26461c83bd65dd79730c51', '273e32c44d8c41d89e828459022d9b51', '课程标题1', '课程描述1', '2024-11-19 00:00:00', '21232f297a57a5a743894a0e4a801fc3', 'd3cfda464f46bcb0a0e1f3462085115f', '2024-11-19 00:00:00', '21232f297a57a5a743894a0e4a801fc3', 'd3cfda464f46bcb0a0e1f3462085115f');


-- ----------------------------
-- Records of eg_media_video
-- ----------------------------
INSERT INTO `eg_media_video` VALUES ('018375c115134f4cb12c23ce230c83a7', '8fcba803d19140d1b56fb05ba0f79b62', '1e5391f2f9964ce8a8bd037eb21104c2', '标题9', '描述9', '2024-11-19 00:00:00', '21232f297a57a5a743894a0e4a801fc3', 'd3cfda464f46bcb0a0e1f3462085115f', '2024-11-19 00:00:00', '21232f297a57a5a743894a0e4a801fc3', 'd3cfda464f46bcb0a0e1f3462085115f');
INSERT INTO `eg_media_video` VALUES ('66a385f4d8e34548b074a1308e7b26f9', '2af4fae5f0c24d4baf95dc182e93d78e', 'af0645bd38494fb09130e1e6d8268b08', '课程标题2', '课程描述2', '2024-11-19 00:00:00', '21232f297a57a5a743894a0e4a801fc3', 'd3cfda464f46bcb0a0e1f3462085115f', '2024-11-19 00:00:00', '21232f297a57a5a743894a0e4a801fc3', 'd3cfda464f46bcb0a0e1f3462085115f');



-- ----------------------------
-- Records of eg_media_video_cus
-- ----------------------------
INSERT INTO `eg_media_video_cus` VALUES ('7ffb0e5307ca4f64b39bfb545f7d7271', 'b6fa283a6e39478abb3b6be04fbef53c', '1e5391f2f9964ce8a8bd037eb21104c2', '标题1', '描述1', '都是，公司，是多少，官网', '899.00', '2024-11-19 00:00:00', '2024-11-19 00:00:00', '21232f297a57a5a743894a0e4a801fc3', 'd3cfda464f46bcb0a0e1f3462085115f', '2024-11-19 00:00:00', '21232f297a57a5a743894a0e4a801fc3', 'd3cfda464f46bcb0a0e1f3462085115f');
INSERT INTO `eg_media_video_cus` VALUES ('a5e0c67645f9498bb44085a3c250794a', '503f1075577c4cf48bb8ce062c046ae9', 'af0645bd38494fb09130e1e6d8268b08', '标题66', '描述66', '审时，公司，官网，委婉', '269.00', '2024-11-01 00:00:00', '2024-11-19 00:00:00', '21232f297a57a5a743894a0e4a801fc3', 'd3cfda464f46bcb0a0e1f3462085115f', '2024-11-19 00:00:00', '21232f297a57a5a743894a0e4a801fc3', 'd3cfda464f46bcb0a0e1f3462085115f');


-- ----------------------------
-- Records of media_mgr
-- ----------------------------
INSERT INTO `sdp_media_mgr` VALUES ('0da270db21924ade989fccda7cbf180d', 'C1DECE5F17B4ACB9C6C9AA048B5FE292', 'mp4', '测试视频 (4).mp4', 'automatic/exp/bs/getMedia/0da270db21924ade989fccda7cbf180d/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('1e5391f2f9964ce8a8bd037eb21104c2', '08058C9EE093693D6052252026EAF41E', 'mp4', '测试视频 (5).mp4', 'automatic/exp/bs/getMedia/1e5391f2f9964ce8a8bd037eb21104c2/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('273e32c44d8c41d89e828459022d9b51', 'F03560AA62F350D655C7953071B850AF', 'png', '课程封面 (7).png', 'automatic/exp/bs/getMedia/273e32c44d8c41d89e828459022d9b51/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('2af4fae5f0c24d4baf95dc182e93d78e', 'A751CDC39CDBD3308B0D8E730442A926', 'png', '课程封面 (12).png', 'automatic/exp/bs/getMedia/2af4fae5f0c24d4baf95dc182e93d78e/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('2e910d39380c45e6886ecbf3cfeb44ab', '61CF6EE43C8BD6E8A4A76676AE6FB5F1', 'png', '课程封面 (1).png', 'automatic/exp/bs/getMedia/2e910d39380c45e6886ecbf3cfeb44ab/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('4e6df95a709c4632bc600341316f04d6', '41A45D4DC33DE2178D6877071044AF82', 'png', '课程封面 (11).png', 'automatic/exp/bs/getMedia/4e6df95a709c4632bc600341316f04d6/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('503f1075577c4cf48bb8ce062c046ae9', 'FF5EA936B172E6383D06AEA76BFA68B0', 'png', '课程封面 (4).png', 'automatic/exp/bs/getMedia/503f1075577c4cf48bb8ce062c046ae9/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('52773036813147299bfa4062b9c9dcc6', '39FBD39D985CC6F7C42BD426FC1BE986', 'docx', 'DDIT_敏捷应用解决方案__20241014.docx', 'automatic/exp/bs/getMedia/52773036813147299bfa4062b9c9dcc6/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('59768758081a490e99e7162b8c49c482', '0CE69498BCBC98C2BB35E0E12649D4F2', 'png', '课程封面 (6).png', 'automatic/exp/bs/getMedia/59768758081a490e99e7162b8c49c482/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('67ba331686224386a25149d09fbfd40a', '3840979929E2447EBBD816185E71D75C', 'zip', '新建 Microso演示.zip', 'automatic/exp/bs/getMedia/67ba331686224386a25149d09fbfd40a/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('687560ce9aac4624bac8da0b3c48f14a', '580E1E5D85FEB45678F4B8BD443D488A', 'mp3', '测试音频.mp3', 'automatic/exp/bs/getMedia/687560ce9aac4624bac8da0b3c48f14a/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('73250a944a45417a94efd3ac71756c7e', '0076F61DF4B9B890EF9CCAF9849514DC', 'flac', '测试音频.flac', 'automatic/exp/bs/getMedia/73250a944a45417a94efd3ac71756c7e/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('8fcba803d19140d1b56fb05ba0f79b62', 'CB0A3FCF3E38483EA9215845244161D8', 'png', '课程封面 (10).png', 'automatic/exp/bs/getMedia/8fcba803d19140d1b56fb05ba0f79b62/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('9345036300af42459045a9da45758ca6', 'F9DD6BC2955BC2136B612EAE24D7F49C', 'xlsx', '数据字典_字典导入模板_v20241119.0.2.4.xlsx', 'automatic/exp/bs/getMedia/9345036300af42459045a9da45758ca6/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('9e5f219537c849efb0433822b8a3a437', 'E4B6239F1B7BEB649E87DD0E7CCE9B0F', 'png', '课程封面 (15).png', 'automatic/exp/bs/getMedia/9e5f219537c849efb0433822b8a3a437/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('a0050358f8944f67ad35d3377e52474a', '77972EE19D75BE88BEB596C23D07C81E', 'pptx', '新建 Microsoft PowerPoint 演示文稿.pptx', 'automatic/exp/bs/getMedia/a0050358f8944f67ad35d3377e52474a/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('a69fd9eea7d64bf68ba43ef9f40e97c7', '5863A936B28B595B3459D9E56B006310', 'png', '课程封面 (3).png', 'automatic/exp/bs/getMedia/a69fd9eea7d64bf68ba43ef9f40e97c7/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('a77fe42df2074779bbccd157a48912d1', '30E7FA01C46E1A8A4C833E7911B97589', 'png', '课程封面 (8).png', 'automatic/exp/bs/getMedia/a77fe42df2074779bbccd157a48912d1/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('af0645bd38494fb09130e1e6d8268b08', '74B71721D8B220BE7684053D9AD99998', 'mp4', '测试视频 (2).mp4', 'automatic/exp/bs/getMedia/af0645bd38494fb09130e1e6d8268b08/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('b67520fed2cb4b1189515c9ad04c6eaf', 'D58D26DF32470A25D11341C32B3475AF', 'png', '课程封面 (2).png', 'automatic/exp/bs/getMedia/b67520fed2cb4b1189515c9ad04c6eaf/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('b6fa283a6e39478abb3b6be04fbef53c', '4C2C48D4A98CF93A49D26AC536A0720C', 'png', '课程封面 (18).png', 'automatic/exp/bs/getMedia/b6fa283a6e39478abb3b6be04fbef53c/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('ba6e49ebe686467bbc49ba8dc26d0af1', '88CA448EC7AEDBCEC110976A7E436242', 'png', '课程封面 (9).png', 'automatic/exp/bs/getMedia/ba6e49ebe686467bbc49ba8dc26d0af1/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('bc3a9fc7f8054629b87d6db03c851625', 'EC242E80F6B46A659FB925376A869A77', 'png', '课程封面 (16).png', 'automatic/exp/bs/getMedia/bc3a9fc7f8054629b87d6db03c851625/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('bdf1cae34c1b40578910961bc1217ee9', '5622649069577DA540989FC802DF929F', 'png', '课程封面 (13).png', 'automatic/exp/bs/getMedia/bdf1cae34c1b40578910961bc1217ee9/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('c0f9c747a15b402f89df8fef1ab36514', 'A43248116D5CE842201ECF5F3688B178', 'mp4', '测试视频 (1).mp4', 'automatic/exp/bs/getMedia/c0f9c747a15b402f89df8fef1ab36514/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('c486705065114b1a90012f0924ce5e55', 'C03080D84F91E1DE05273AFF1F31798F', 'png', '课程封面 (19).png', 'automatic/exp/bs/getMedia/c486705065114b1a90012f0924ce5e55/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('cb1b987ffc4d4a55ab9215d74c5fa6fd', 'DFC9A70A48011C7D968353B7DD18C460', 'png', '课程封面 (17).png', 'automatic/exp/bs/getMedia/cb1b987ffc4d4a55ab9215d74c5fa6fd/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('d5f2cb007440432285694537389126a4', 'B7D9C838922D8DE890C49C197D8F845D', 'mp4', '测试视频 (3).mp4', 'automatic/exp/bs/getMedia/d5f2cb007440432285694537389126a4/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('e7669649b2e04b8091507b3a3ba03fba', '66E2F41D4131B5CAEADCC326DAA0FFF1', 'png', '课程封面 (14).png', 'automatic/exp/bs/getMedia/e7669649b2e04b8091507b3a3ba03fba/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
INSERT INTO `sdp_media_mgr` VALUES ('f94c7566022d433cad83784fec819dd8', '4E81F492FE8867B04CDADBF15FC293F4', 'png', '课程封面 (5).png', 'automatic/exp/bs/getMedia/f94c7566022d433cad83784fec819dd8/ecb01d8ff0aa4f4e5ae59d55afbb0ef6', '文件', null, null, '2024-11-19 00:00:00', null, null, '2024-11-19 00:00:00', null, null);
