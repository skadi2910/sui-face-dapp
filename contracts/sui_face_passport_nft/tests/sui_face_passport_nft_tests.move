// #[test_only]
// module sui_face_passport_nft::sui_face_passport_nft_tests {
//     use sui_face_passport_nft::sui_face_passport_nft::{Self, MintRegistry};
//     use sui::test_scenario::{Self as ts};
//     use sui_face_passport_nft::sui_face_passport_nft::SUI_FACE_PASSPORT_NFT;    

//     const ADMIN: address = @0xAD;

//     #[test]
//     fun test_init_registry() {
//         let mut scenario = ts::begin(ADMIN);
        
//         // Initialize registry
//         {
//             sui_face_passport_nft::init(SUI_FACE_PASSPORT_NFT, ts::ctx(&mut scenario));
//         };
        
//         // Check registry was created and shared
//         ts::next_tx(&mut scenario, ADMIN);
//         {
//             assert!(ts::has_most_recent_shared<MintRegistry>(), 0);
//         };
        
//         ts::end(scenario);
//     }

//     // #[test]
//     // fun test_registry_exists() {
//     //     let mut scenario = ts::begin(ADMIN);
        
//     //     // Initialize registry
//     //     {
//     //         sui_face_passport_nft::init(ts::ctx(&mut scenario));
//     //     };
        
//     //     // Verify registry can be accessed
//     //     ts::next_tx(&mut scenario, ADMIN);
//     //     {
//     //         let registry = ts::take_shared<MintRegistry>(&scenario);
//     //         ts::return_shared(registry);
//     //     };
        
//     //     ts::end(scenario);
//     // }
// }