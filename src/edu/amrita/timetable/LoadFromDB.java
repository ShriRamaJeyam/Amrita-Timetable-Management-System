package edu.amrita.timetable;
import java.util.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.json.simple.JSONArray;
import org.json.simple.JSONValue;

@SuppressWarnings("unused")
public class LoadFromDB 
{
	private static String host="localhost",user="sa",pass="NirU26@^",db="ATMS";
	private static String ConnectionURL="jdbc:sqlserver://"+host+":1433;database="+db+";user="+user+";password="+pass+";encrypt=true;trustServerCertificate=true;loginTimeout=30;";
	public static boolean Load()
	{
		try (Connection connection = DriverManager.getConnection(ConnectionURL);) 
		{
			Random rndm = new Random();
			//Faculty and FacultyGroup
			{
			   Statement stmt=connection.createStatement();
			   String sqlquery="select [id] from dbo.Teachers;";
			   ResultSet rs=stmt.executeQuery(sqlquery);
			   while (rs.next())
			   {
					Integer id=rs.getInt("id");
					MapClass.TeacherList.add(id);
					List<Integer> lst=new ArrayList<Integer>();
					lst.add(id);
					MapClass.TeacherMap.put(id,lst);
			   }
			   rs.close();
			   stmt.close();

			   stmt=connection.createStatement();
			   sqlquery="select TeacherID,TeacherGroupID from TeacherGroupMembers;";
			   rs=stmt.executeQuery(sqlquery);
			   while (rs.next())
			   {
					int ID=rs.getInt("TeacherID");
					int GID=rs.getInt("TeacherGroupID");
					if(!MapClass.TeacherMap.containsKey(GID))
					{
						MapClass.TeacherMap.put(GID,new ArrayList<Integer>());
					}
					MapClass.TeacherMap.get(GID).add(ID);
			   }
			   rs.close();
			   stmt.close();
			}

			//Rooms and RoomGroup
			{
			   Statement stmt=connection.createStatement();
			   String sqlquery="select * from Rooms;";
			   ResultSet rs=stmt.executeQuery(sqlquery);
			   while (rs.next())
			   {
					int id=rs.getInt("id");
					int RegionID=rs.getInt("RegionID");
					MapClass.RoomList.add(id);
					List<Integer> lst=new ArrayList<Integer>();
					lst.add(id);
					MapClass.RoomMap.put(id,lst);
					MapClass.RoomRegionMap.put(id,RegionID);
			   }
			   rs.close();
			   stmt.close();

			   stmt=connection.createStatement();
			   sqlquery="select * from RoomGroupMembers;";
			   rs=stmt.executeQuery(sqlquery);
			   while (rs.next())
			   {
					int ID=rs.getInt("RoomID");
					int GID=rs.getInt("RoomGroupID");
					if(!MapClass.RoomMap.containsKey(GID))
					{
						MapClass.RoomMap.put(GID,new ArrayList<Integer>());
					}
					MapClass.RoomMap.get(GID).add(MapClass.RoomMap.get(ID).get(0));
			   }

			}

			//TimeSlot and TimeSlotGroup
			{
			   Statement stmt=connection.createStatement();
			   String sqlquery = "select * from TimeSlots;";
			   ResultSet rs = stmt.executeQuery(sqlquery);
			   while (rs.next())
			   {
					TimeSlot slt = new TimeSlot(),tenSlt =new TimeSlot(),thirtySlt = new TimeSlot();
					slt.id = rs.getInt("id");
					slt.starter = rs.getInt("starter");
					slt.ender = rs.getInt("ender");
					{
						tenSlt.id = 0 - slt.id;
						tenSlt.starter = slt.ender;
						tenSlt.ender = tenSlt.starter + 10;
						MapClass.TimeSlotList.add(tenSlt);
						List<Integer> lst=new ArrayList<Integer>();
						lst.add(tenSlt.id);
						MapClass.TimeSlotMap.put(tenSlt.id,lst);
					}
					{
						thirtySlt.id = (-1) - slt.id;
						thirtySlt.starter = slt.ender;
						thirtySlt.ender = thirtySlt.starter + 30;
						MapClass.TimeSlotList.add(thirtySlt);
						List<Integer> lst=new ArrayList<Integer>();
						lst.add(thirtySlt.id);
						MapClass.TimeSlotMap.put(thirtySlt.id,lst);
					}
					if(rs.getBoolean("hasBreak"))
					{
						slt.hasBreak = true;
						slt.startBreak = rs.getInt("startBreak");
						slt.endBreak = rs.getInt("endBreak");
					}
					MapClass.TimeSlotList.add(slt);
					List<Integer> lst=new ArrayList<Integer>();
					lst.add(slt.id);
					MapClass.TimeSlotMap.put(slt.id,lst);
					if(rs.getString("description").equals("Lunch"))
                    {
                        MapClass.food = slt;
                    }
                   if(rs.getString("description").equals("LunchCompensation"))
                   {
                       MapClass.foodComp = slt;
                   }
			   }
			   rs.close();
			   stmt.close();

			   stmt=connection.createStatement();
			   sqlquery="select * from TimeSlotGroupMembers;";
			   rs=stmt.executeQuery(sqlquery);
			   while (rs.next())
			   {
					int ID=rs.getInt("TimeSlotID");
					int GID=rs.getInt("TimeSlotGroupID");
					if(!MapClass.TimeSlotMap.containsKey(GID))
					{
						MapClass.TimeSlotMap.put(GID,new ArrayList<Integer>());
					}
					MapClass.TimeSlotMap.get(GID).add(ID);
			   }
			   //System.out.println(MapClass.TimeSlotGroup);
			   //System.out.println(MapClass.TimeSlotList);
			}

			//Sections and SectionsGroup
			{
				Statement stmt=connection.createStatement();
				String sqlquery="select * from Sections;";
				ResultSet rs=stmt.executeQuery(sqlquery);
				while (rs.next())
				{
					int id=rs.getInt("id");
					MapClass.SectionList.add(id);
					List<Integer> lst=new ArrayList<Integer>();
					lst.add(id);
					MapClass.SectionMap.put(id,lst);
				}
				rs.close();
				stmt.close();

				stmt=connection.createStatement();
				sqlquery="select * from SectionGroupMembers;";
				rs=stmt.executeQuery(sqlquery);
				while (rs.next())
				{
					int ID=rs.getInt("SectionID");
					int GID=rs.getInt("SectionGroupID");
					if(!MapClass.SectionMap.containsKey(GID))
					{
						MapClass.SectionMap.put(GID,new ArrayList<Integer>());
					}
					MapClass.SectionMap.get(GID).add(ID);
				}

			}

			//Lectures
			{
			   Statement stmt=connection.createStatement();
			   String sqlquery="select * from SolutionLectures;";
			   ResultSet rs=stmt.executeQuery(sqlquery);
			   while (rs.next())
			   {
				   try
				   {

					   Lecture lec=new Lecture();
					   int solutionID = rs.getInt("SolutionID");
					   lec.id = rs.getInt("id");
					   lec.TimeSlotSrc = MapClass.TimeSlotMap.get(rs.getInt("TimeSlotSource"));
					   lec.TimeSlotSrcID = rs.getInt("TimeSlotSource");
					   lec.RoomSrc = MapClass.RoomMap.get(rs.getInt("RoomSource"));
                       lec.Teacher = MapClass.TeacherMap.get(rs.getInt("Faculty"));
                       lec.Section = MapClass.SectionMap.get(rs.getInt("SectionID"));
                       lec.Course = rs.getInt("CourseID");
                       if(rs.getObject("Parent")!=null)
					   {
					   	lec.Parent = rs.getInt("Parent");
					   }
					   // Day Source
					   {
						   Object[] days = ((JSONArray)JSONValue.parse(rs.getString("DaySource"))).toArray();
						   lec.DaySrc = new ArrayList<Integer>();
						   for(int i=0;i!=days.length;i++)
						   {
						   		lec.DaySrc.add(Integer.decode(days[i].toString()));
						   }

					   }
					   if(rs.getObject("Room")!=null)
					   {
							lec.Room =rs.getInt("Room");
					   }
					   else {
							lec.Room = lec.RoomSrc.get(rndm.nextInt(lec.RoomSrc.size()));
					   }
					   if(rs.getObject("TimeSlot")!=null)
					   {
						   lec.TimeSlot =rs.getInt("TimeSlot");
					   }
					   else
					   {
						   lec.TimeSlot = lec.TimeSlotSrc.get(rndm.nextInt(lec.TimeSlotSrc.size()));
					   }
					   if(rs.getObject("Day")!=null)
					   {
						   lec.Day = rs.getInt("Day");
					   }
					   else
					   {
						   lec.Day = lec.DaySrc.get(rndm.nextInt(lec.DaySrc.size()));
					   }
					   if(!MapClass.SolutionLectureMap.containsKey(solutionID))
					   {
					   		MapClass.SolutionLectureMap.put(solutionID, new ArrayList<Lecture>());
					   }
					   if( lec.DaySrc.size() != 0 && lec.TimeSlotSrc.size()  != 0 && lec.RoomSrc.size() != 0 && lec.Teacher.size() !=0 && lec.Section.size() != 0 )
					       MapClass.SolutionLectureMap.get(solutionID).add(lec);
				   }
				   catch(Exception e)
				   {
						e.printStackTrace();
				   }
			   }
			   rs.close();
			   stmt.close();
			}

		}
		catch (SQLException e) 
		{
			e.printStackTrace();
			return false;
		}
		for(int I=0;I!=MapClass.TimeSlotList.size();I++)
		{
			int i = MapClass.TimeSlotList.get(I).id;
            if(!MapClass.food.doesNotIntersect(MapClass.TimeSlotList.get(I)))
            {
                MapClass.foodConflict.add(i);
            }
            if(!MapClass.foodComp.doesNotIntersect(MapClass.TimeSlotList.get(I)))
            {
                MapClass.foodCompConflict.add(i);
            }
			if(!MapClass.TimeSlotConflict.containsKey(i)) {
				MapClass.TimeSlotConflict.put(i, new TreeSet<Integer>());
			}
            MapClass.TimeSlotConflict.get(i).add(i);
			for(int J=I+1;J!=MapClass.TimeSlotList.size();J++)
			{
				int j = MapClass.TimeSlotList.get(J).id;
				if(!MapClass.TimeSlotConflict.containsKey(j)) {
					MapClass.TimeSlotConflict.put(j, new TreeSet<Integer>());
				}
				if(!MapClass.TimeSlotList.get(I).doesNotIntersect(MapClass.TimeSlotList.get(J)))
				{
					MapClass.TimeSlotConflict.get(i).add(j);
					MapClass.TimeSlotConflict.get(j).add(i);
				}

			}
		}
		System.out.println(MapClass.TimeSlotConflict.toString());
		return true;
	}
	public static void store(Solver s)
	{
		try (Connection connection = DriverManager.getConnection(ConnectionURL)) 
		{
			connection.setAutoCommit(false);
			for(int i=0;i!=s.getLeclst().size();i++)
			{
				Lecture e=s.getLeclst().get(i);
				String sqlquery="UPDATE SolutionLectures SET Room="+e.Room+",Day ="+e.Day+",TimeSlot="+e.TimeSlot+" WHERE id="+e.id+";";
				Statement stmt=connection.createStatement();
				stmt.executeUpdate(sqlquery);
				stmt.close();
			}
			connection.commit();
			connection.close();
        }
        catch (SQLException e) 
		{
		       e.printStackTrace();
		}
	}
}
