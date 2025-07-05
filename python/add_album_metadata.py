#!/usr/bin/env python3
"""
Add Album Metadata
Adds genres, moods, and top tracks metadata to album mapping
"""

import json
import os

def get_album_metadata():
    """Define metadata for each album in the ROOM playlist"""
    
    # Metadata mapping for each album
    album_metadata = {
        # Playboi Carti - Die Lit
        "Die Lit": {
            "genres": ["Hip-Hop", "Trap", "Rap"],
            "moods": ["Energetic", "Hype", "Confident"],
            "top_tracks": ["Long Time - Intro", "Shoota", "Pull Up", "R.I.P.", "Fell In Luv"]
        },
        
        # Young Thug - So Much Fun
        "So Much Fun": {
            "genres": ["Hip-Hop", "Trap", "Rap"],
            "moods": ["Energetic", "Playful", "Confident"],
            "top_tracks": ["Ecstasy (feat. Machine Gun Kelly)", "Hot", "Bad Bad Bad", "What's The Move", "Jumped Out The Window"]
        },
        
        # Saba - CARE FOR ME
        "CARE FOR ME": {
            "genres": ["Hip-Hop", "Conscious Rap", "Alternative Hip-Hop"],
            "moods": ["Reflective", "Melancholic", "Thoughtful"],
            "top_tracks": ["BROKEN GIRLS", "LIFE", "CALLIGRAPHY", "LOGOUT", "FIGHTER"]
        },
        
        # Erykah Badu - Mama's Gun
        "Mama's Gun": {
            "genres": ["R&B", "Soul", "Neo-Soul"],
            "moods": ["Chill", "Smooth", "Nostalgic"],
            "top_tracks": ["Didn't Cha Know", "Bag Lady", "On & On", "Cleva", "Green Eyes"]
        },
        
        # Isaiah Rashad - The Sun's Tirade
        "The Sun's Tirade": {
            "genres": ["Hip-Hop", "Alternative Hip-Hop", "Southern Hip-Hop"],
            "moods": ["Chill", "Reflective", "Smooth"],
            "top_tracks": ["Silkk da Shocka (feat. Syd)", "4r Da Squaw", "Wat's Wrong", "Free Lunch", "Tity and Dolla"]
        },
        
        # Childish Gambino - Because the Internet
        "Because the Internet": {
            "genres": ["Hip-Hop", "Alternative Hip-Hop", "R&B"],
            "moods": ["Thoughtful", "Experimental", "Nostalgic"],
            "top_tracks": ["I. The Worst Guys", "3005", "Sweatpants", "Telegraph Ave.", "Crawl"]
        },
        
        # A$AP Rocky - TESTING
        "TESTING": {
            "genres": ["Hip-Hop", "Alternative Hip-Hop", "Trap"],
            "moods": ["Experimental", "Confident", "Energetic"],
            "top_tracks": ["Hun43rd", "A$AP Forever", "Praise The Lord", "Distorted Records", "Buck Shots"]
        },
        
        # JID - The Never Story
        "The Never Story": {
            "genres": ["Hip-Hop", "Conscious Rap", "Alternative Hip-Hop"],
            "moods": ["Thoughtful", "Energetic", "Confident"],
            "top_tracks": ["Doo Wop", "NEVER", "LAUDER", "Hereditary", "8701"]
        },
        
        # Travis Scott - Birds In The Trap Sing McKnight
        "Birds In The Trap Sing McKnight": {
            "genres": ["Hip-Hop", "Trap", "Alternative Hip-Hop"],
            "moods": ["Atmospheric", "Energetic", "Dark"],
            "top_tracks": ["through the late night", "goosebumps", "pick up the phone", "beibs in the trap", "sweet sweet"]
        },
        
        # KAYTRANADA - BUBBA
        "BUBBA": {
            "genres": ["Electronic", "House", "Hip-Hop"],
            "moods": ["Chill", "Groovy", "Energetic"],
            "top_tracks": ["DO IT", "10%", "What You Need", "Taste", "Go DJ"]
        },
        
        # Chance the Rapper - Acid Rap
        "Acid Rap": {
            "genres": ["Hip-Hop", "Alternative Hip-Hop", "Conscious Rap"],
            "moods": ["Energetic", "Playful", "Thoughtful"],
            "top_tracks": ["Acid Rain", "Cocoa Butter Kisses", "Juice", "Favorite Song", "Chain Smoker"]
        },
        
        # Kanye West - Graduation
        "Graduation": {
            "genres": ["Hip-Hop", "Pop Rap", "Alternative Hip-Hop"],
            "moods": ["Energetic", "Confident", "Nostalgic"],
            "top_tracks": ["Good Morning", "Stronger", "I Wonder", "Flashing Lights", "Homecoming"]
        },
        
        # Migos - Culture
        "Culture": {
            "genres": ["Hip-Hop", "Trap", "Rap"],
            "moods": ["Energetic", "Hype", "Confident"],
            "top_tracks": ["Kelly Price (feat. Travis Scott)", "Bad and Boujee", "T-Shirt", "Call Casting", "Get Right Witcha"]
        },
        
        # Lil Uzi Vert - Lil Uzi Vert vs. The World
        "Lil Uzi Vert vs. The World": {
            "genres": ["Hip-Hop", "Trap", "Alternative Hip-Hop"],
            "moods": ["Energetic", "Playful", "Confident"],
            "top_tracks": ["You Was Right", "Money Longer", "Baby Are You Home", "Canadian Goose", "Hi Roller"]
        },
        
        # SZA - Ctrl
        "Ctrl": {
            "genres": ["R&B", "Alternative R&B", "Soul"],
            "moods": ["Chill", "Smooth", "Reflective"],
            "top_tracks": ["Pretty Little Birds (feat. Isaiah Rashad)", "Love Galore", "The Weekend", "Drew Barrymore", "Supermodel"]
        },
        
        # Kendrick Lamar - untitled unmastered.
        "untitled unmastered.": {
            "genres": ["Hip-Hop", "Conscious Rap", "Alternative Hip-Hop"],
            "moods": ["Thoughtful", "Experimental", "Reflective"],
            "top_tracks": ["untitled 05 | 09.21.2014.", "untitled 02 | 06.23.2014.", "untitled 07 | 2014-2016", "untitled 08 | 09.06.2014.", "untitled 01 | 08.19.2014."]
        },
        
        # PARTYNEXTDOOR - PARTYPACK
        "PARTYPACK": {
            "genres": ["R&B", "Alternative R&B", "Hip-Hop"],
            "moods": ["Chill", "Smooth", "Sensual"],
            "top_tracks": ["Persian Rugs", "Don't Run", "Don't Know How", "Loyal", "Sex On The Beach"]
        },
        
        # Mac Miller - GO:OD AM
        "GO:OD AM": {
            "genres": ["Hip-Hop", "Alternative Hip-Hop", "Conscious Rap"],
            "moods": ["Reflective", "Thoughtful", "Energetic"],
            "top_tracks": ["Brand Name", "Weekend", "100 Grandkids", "Break The Law", "Perfect Circle / God Speed"]
        },
        
        # Bryson Tiller - T R A P S O U L (Deluxe)
        "T R A P S O U L (Deluxe)": {
            "genres": ["R&B", "Alternative R&B", "Hip-Hop"],
            "moods": ["Chill", "Smooth", "Sensual"],
            "top_tracks": ["Exchange", "Don't", "Let Em' Know", "Overtime", "502 Come Up"]
        },
        
        # Smino - blkswn
        "blkswn": {
            "genres": ["Hip-Hop", "Alternative Hip-Hop", "R&B"],
            "moods": ["Chill", "Smooth", "Playful"],
            "top_tracks": ["Wild Irish Roses", "Anita", "Glass Flows", "Amphetamine", "Father Son Holy Smoke"]
        },
        
        # Drake - Take Care (Deluxe)
        "Take Care (Deluxe)": {
            "genres": ["Hip-Hop", "R&B", "Pop Rap"],
            "moods": ["Chill", "Smooth", "Reflective"],
            "top_tracks": ["Marvins Room", "Take Care", "Headlines", "The Motto", "HYFR"]
        },
        
        # Jhené Aiko - Trip
        "Trip": {
            "genres": ["R&B", "Alternative R&B", "Soul"],
            "moods": ["Chill", "Smooth", "Reflective"],
            "top_tracks": ["While We're Young", "Sativa", "Oblivion", "New Balance", "Mystic Journey"]
        },
        
        # Travis Scott - ASTROWORLD
        "ASTROWORLD": {
            "genres": ["Hip-Hop", "Trap", "Alternative Hip-Hop"],
            "moods": ["Atmospheric", "Energetic", "Dark"],
            "top_tracks": ["STARGAZING", "SICKO MODE", "CAROUSEL", "R.I.P. SCREW", "NO BYSTANDERS"]
        },
        
        # Mac Miller - Swimming
        "Swimming": {
            "genres": ["Hip-Hop", "Alternative Hip-Hop", "Conscious Rap"],
            "moods": ["Reflective", "Melancholic", "Thoughtful"],
            "top_tracks": ["Self Care", "What's The Use?", "Ladders", "2009", "So It Goes"]
        },
        
        # J. Cole - Born Sinner (Deluxe Version)
        "Born Sinner (Deluxe Version)": {
            "genres": ["Hip-Hop", "Conscious Rap", "Alternative Hip-Hop"],
            "moods": ["Thoughtful", "Reflective", "Confident"],
            "top_tracks": ["Power Trip", "Crooked Smile", "Forbidden Fruit", "Let Nas Down", "Chaining Day"]
        },
        
        # Kendrick Lamar - Black Panther The Album Music From And Inspired By
        "Black Panther The Album Music From And Inspired By": {
            "genres": ["Hip-Hop", "Conscious Rap", "Soundtrack"],
            "moods": ["Energetic", "Empowering", "Confident"],
            "top_tracks": ["All The Stars (with SZA)", "King's Dead", "Pray For Me", "Opps", "Big Shot"]
        },
        
        # The Internet - Ego Death
        "Ego Death": {
            "genres": ["R&B", "Alternative R&B", "Soul"],
            "moods": ["Chill", "Smooth", "Reflective"],
            "top_tracks": ["Get Away", "Special Affair", "Girl", "Under Control", "Go With It"]
        },
        
        # Frank Ocean - Blonde
        "Blonde": {
            "genres": ["R&B", "Alternative R&B", "Soul"],
            "moods": ["Chill", "Smooth", "Reflective"],
            "top_tracks": ["Pink + White", "Self Control", "Nights", "Ivy", "Nikes"]
        },
        
        # Ms. Lauryn Hill - The Miseducation of Lauryn Hill
        "The Miseducation of Lauryn Hill": {
            "genres": ["R&B", "Soul", "Hip-Hop"],
            "moods": ["Nostalgic", "Empowering", "Reflective"],
            "top_tracks": ["Doo Wop (That Thing)", "Ex-Factor", "To Zion", "Everything Is Everything", "Lost Ones"]
        },
        
        # SZA - Z
        "Z": {
            "genres": ["R&B", "Alternative R&B", "Soul"],
            "moods": ["Chill", "Smooth", "Reflective"],
            "top_tracks": ["Childs Play", "Julia", "Sweet November", "HiiiJack", "Babylon"]
        },
        
        # KAYTRANADA - TIMELESS
        "TIMELESS": {
            "genres": ["Electronic", "House", "Hip-Hop"],
            "moods": ["Chill", "Groovy", "Energetic"],
            "top_tracks": ["Witchy (feat. Childish Gambino)", "Lover/Friend", "Seemingly", "Stuntin", "More Than A Little Bit"]
        },
        
        # Kendrick Lamar - good kid, m.A.A.d city (Deluxe)
        "good kid, m.A.A.d city (Deluxe)": {
            "genres": ["Hip-Hop", "Conscious Rap", "Alternative Hip-Hop"],
            "moods": ["Thoughtful", "Reflective", "Nostalgic"],
            "top_tracks": ["Bitch, Don't Kill My Vibe", "Money Trees", "Swimming Pools (Drank)", "Poetic Justice", "m.A.A.d city"]
        },
        
        # Daft Punk - Discovery
        "Discovery": {
            "genres": ["Electronic", "House", "French House"],
            "moods": ["Energetic", "Nostalgic", "Groovy"],
            "top_tracks": ["One More Time", "Harder, Better, Faster, Stronger", "Digital Love", "Aerodynamic", "Face to Face"]
        },
        
        # Mac Miller - The Divine Feminine
        "The Divine Feminine": {
            "genres": ["Hip-Hop", "Alternative Hip-Hop", "R&B"],
            "moods": ["Smooth", "Sensual", "Reflective"],
            "top_tracks": ["Congratulations (feat. Bilal)", "Dang!", "We", "My Favorite Part", "God Is Fair, Sexy Nasty"]
        },
        
        # Frank Ocean - channel ORANGE
        "channel ORANGE": {
            "genres": ["R&B", "Alternative R&B", "Soul"],
            "moods": ["Chill", "Smooth", "Reflective"],
            "top_tracks": ["Pyramids", "Thinkin Bout You", "Super Rich Kids", "Pink Matter", "Lost"]
        },
        
        # Huncho Jack - Huncho Jack, Jack Huncho
        "Huncho Jack, Jack Huncho": {
            "genres": ["Hip-Hop", "Trap", "Rap"],
            "moods": ["Energetic", "Confident", "Hype"],
            "top_tracks": ["Saint", "Eye 2 Eye", "Moon Rock", "Motorcycle Patches", "Dubai Shit"]
        },
        
        # J. Cole - 4 Your Eyez Only
        "4 Your Eyez Only": {
            "genres": ["Hip-Hop", "Conscious Rap", "Alternative Hip-Hop"],
            "moods": ["Thoughtful", "Reflective", "Serious"],
            "top_tracks": ["Neighbors", "Immortal", "Deja Vu", "Ville Mentality", "4 Your Eyez Only"]
        },
        
        # Joey Bada$$ - 1999
        "1999": {
            "genres": ["Hip-Hop", "Conscious Rap", "Alternative Hip-Hop"],
            "moods": ["Nostalgic", "Thoughtful", "Confident"],
            "top_tracks": ["Survival Tactics", "Waves", "Hardknock", "Snakes", "World Domination"]
        },
        
        # D. Savage - BPL
        "BPL": {
            "genres": ["Hip-Hop", "Trap", "Rap"],
            "moods": ["Energetic", "Confident", "Hype"],
            "top_tracks": ["Stay Alert", "Bring Me Down", "BPL", "No Hook", "D Savage"]
        },
        
        # Miles Davis - Kind Of Blue (Legacy Edition)
        "Kind Of Blue (Legacy Edition)": {
            "genres": ["Jazz", "Modal Jazz", "Cool Jazz"],
            "moods": ["Chill", "Smooth", "Nostalgic"],
            "top_tracks": ["So What", "Blue in Green", "All Blues", "Flamenco Sketches", "Freddie Freeloader"]
        }
    }
    
    return album_metadata

def add_metadata_to_albums():
    """Add metadata to the album mapping file"""
    
    print("🎵 Adding Metadata to ROOM Playlist Albums")
    print("=" * 50)
    
    # Load the current album mapping
    mapping_file = "data/ROOM_playlist_album_image_mapping_ordered.json"
    if not os.path.exists(mapping_file):
        print(f"❌ Album mapping file not found: {mapping_file}")
        return
    
    with open(mapping_file, 'r') as f:
        albums = json.load(f)
    
    # Get metadata mapping
    metadata = get_album_metadata()
    
    print(f"📊 Processing {len(albums)} albums...")
    
    # Add metadata to each album
    for album in albums:
        album_name = album['name']
        
        if album_name in metadata:
            album['genres'] = metadata[album_name]['genres']
            album['moods'] = metadata[album_name]['moods']
            album['top_tracks'] = metadata[album_name]['top_tracks']
            print(f"✅ Added metadata to: {album_name}")
        else:
            # Default metadata for albums not in the mapping
            album['genres'] = ["Hip-Hop", "R&B"]
            album['moods'] = ["Chill", "Energetic"]
            album['top_tracks'] = [album.get('track_name', 'Unknown Track')]
            print(f"⚠️  Using default metadata for: {album_name}")
    
    # Save the updated mapping
    output_file = "data/ROOM_playlist_album_image_mapping_with_metadata.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(albums, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Updated album mapping saved to: {output_file}")
    
    # Show sample of updated data
    print(f"\n📋 Sample Updated Album Data:")
    print("-" * 40)
    for album in albums[:3]:
        print(f"🎵 {album['name']} - {album['artist']}")
        print(f"   Genres: {', '.join(album['genres'])}")
        print(f"   Moods: {', '.join(album['moods'])}")
        print(f"   Top Tracks: {', '.join(album['top_tracks'][:3])}...")
        print()
    
    return albums

def main():
    print("🎵 ROOM Playlist Metadata Addition")
    print("=" * 50)
    
    # Add metadata to albums
    updated_albums = add_metadata_to_albums()
    
    if updated_albums:
        print(f"\n🎉 Metadata addition complete!")
        print(f"📁 New file created: ROOM_playlist_album_image_mapping_with_metadata.json")
        print(f"📊 {len(updated_albums)} albums now have genres, moods, and top tracks metadata!")

if __name__ == "__main__":
    main() 