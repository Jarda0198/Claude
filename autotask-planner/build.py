#!/usr/bin/env python3
"""Sestaví dist/autotask-core.js, dist/bookmarklet.txt a dist/autotask-bookmarks.html ze src/."""
import os, urllib.parse
here=os.path.dirname(os.path.abspath(__file__))
rd=lambda f: open(os.path.join(here,'src',f),encoding='utf8').read()
core=rd('engine.js')+rd('ui.js')
head="/* AutoTask Planner v2 (DOM-only, bez Salesforce API). Panel žije v okně Opportunities; skenování a vyplňování běží v jednom pomocném okně (same-origin). */\n"
os.makedirs(os.path.join(here,'dist'),exist_ok=True)
open(os.path.join(here,'dist','autotask-core.js'),'w',encoding='utf8').write(head+core)
url='javascript:'+urllib.parse.quote(head+core,safe="()!~*'")
open(os.path.join(here,'dist','bookmarklet.txt'),'w',encoding='utf8').write(url)
open(os.path.join(here,'dist','autotask-bookmarks.html'),'w',encoding='utf8').write(
 '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n<TITLE>Bookmarks</TITLE>\n<H1>Bookmarks</H1>\n<DL><p>\n    <DT><A HREF="%s">AutoTask Planner</A>\n</DL><p>\n'%url)
print('core',len(head+core),'bookmarklet',len(url))
